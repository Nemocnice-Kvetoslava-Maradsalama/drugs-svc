function getPrescription(req, res, logger, client, axios, access_tkn) {
    const { illnessIds } = req.params;
    const CancelToken = axios.CancelToken;
    let source = CancelToken.source();
    let error = ''
    setTimeout(() => {
        source.cancel();
        error = 'DISEASE-SVC is taking too much time to respond'
      }, 4000);
    let drugs = {};
    let illnesses = illnessIds.split(',');
    logger.info('Getting instance of disease-svc and personel-svc');
    const diseaseInstances = client.getInstancesByAppId('DISEASE-SVC');
    const personelInstances = client.getInstancesByAppId('PERSONNEL-SVC');
    if (!diseaseInstances) { logger.error('Could not connect to DISEASE-SVC');}
    if (!personelInstances) { logger.error('Could not connect to DISEASE-SVC');}
    const diseaseHostname = diseaseInstances ?  `http://${diseaseInstances[0].ipAddr}:${diseaseInstances[0].port.$}` : '';
    const personelHostname = personelInstances ? `http://${personelInstances[0].ipAddr}:${personelInstances[0].port.$}` : '';
    if (diseaseInstances) {logger.info(`Connected to DISEASE-SVC, which is running on ${diseaseHostname}`);}
    if (personelInstances) {logger.info(`Connected to PERSONNEL-SVC, which is running on ${personelHostname}`);}
    //ask 
    axios.get(`${personelHostname}/doctors`).then((resp)=>{
        if (resp && resp.data && resp.data[0]){
            logger.info(`${resp.data[0].firstname} ${resp.data[0].lastname} prescribed ${drugs}`)
        }
            }).catch(e => logger.warn('Could not verify the doctor'))
            .finally(()=>{
            })
    let count = illnesses.length;
    if (illnesses) {
        logger.info('Looking for drugs that cures diseases: ' + illnessIds);
        let n = 0;
        let fail = false;
        illnesses.forEach(id => {
            axios.get(`${diseaseHostname}/disease/${id}`, { cancelToken: source.token, headers: { Authorization: access_tkn } })
                .then(function (response) {
                    if (!response || !response.data) {
                        error = `Error: disease with id ${id} does not exist`;
                        logger.error(`Error: disease with id ${id} does not exist`);
                        fail = true;
                    }
                    else {
                        drugs[response.data.id] = response.data.cures;
                    }
                })
                .catch(function (err) {
                    // handle error
                    const errTxt = 'Error: something broke while requesting data from DISEACE-SVC'
                    logger.error(errTxt,' ', err.message);
                    if (!error.includes('taking too much')) {
                        error = errTxt
                    }
                })
                .finally(function () {
                    n = n + 1;
                    if (Object.keys(drugs).length != 0) {
                        console.log(drugs)
                        res.status(200).send(drugs)
                    }
                    else {
                        if (error != '') {
                            res.status(400).send(error)
                        }
                        else {
                            res.status(400).send('Error: no disease ids were specified');
                        }
                    }
                });
        });
    }
   
}

function getAll(res, logger, drug) {
    drug.find().then((resp) => {
        logger.info('Fetching all drugs from the database');
        res.status(200).send(resp);
    }).catch(err => {
        logger.error(err)
        res.status(400).send(err);
    });
}

function getDrugById(req, res, logger, drug) {
    const { id } = req.params;
    logger.info(`Fetching drug with id ${id}`)
    drug.findById(id).then(resp => res.status(200).send(resp)).catch(err => res.status(400).send(err));
}

function getDrugByName(req, res, logger, drug) {
    const { name } = req.params;
    logger.info(`Fetching drug with name ${name}`)
    drug.findOne({ name: name }).then(resp => res.status(200).send(resp)).catch(err => res.status(400).send(err));
}

function updateDrug(req, res, logger, drug) {
    const { id, availability, amount } = req.params;
    logger.info(`Updating drug with id ${id}`)
    drug.findOneAndUpdate({ _id: id }, { available: availability, amount: amount }).then((dr) => res.status(200).send(dr))
        .catch((err) => res.status(400).send(err));
}

function deleteDrug(req, res, logger, drug) {
    const { id } = req.params;
    logger.info(`Deleting drug with id ${id}`)
    drug.findByIdAndDelete({ _id: id }).then(resp => res.status(200).send(resp)).catch(err => res.status(400).send(err));
}

function createDrug(req, res, logger, drug) {
    const { name, availability } = req.params;
    logger.info(`Creating drug with name ${name}`)
    drug.create({
        name: name,
        available: true
    }).then((savedDrug) => res.status(201).send(savedDrug)).catch(err => {
        console.log(err);
        res.status(400).send(err);
    });
}


module.exports = { getPrescription, getAll, getDrugById, getDrugByName, updateDrug, deleteDrug, createDrug  }