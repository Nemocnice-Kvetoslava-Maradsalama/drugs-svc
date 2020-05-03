function getPrescription(req, res, logger, client, axios) {
    const { illnessIds } = req.params;
    let drugs = {};
    let illnesses = illnessIds.split(',');
    logger.info('Getting instance of disease-svc and personel-svc');
    const diseaseInstances = client.getInstancesByAppId('DISEASE-SVC');
    const personelInstances = client.getInstancesByAppId('PERSONNEL-SVC');
    if (!diseaseInstances) { logger.error('Could not connect to DISEASE-SVC');}
    if (!personelInstances) { logger.error('Could not connect to DISEASE-SVC');}
    const diseaseHostname = `http://${diseaseInstances[0].hostName}:${diseaseInstances[0].port.$}`;
    const personelHostname = `http://${personelInstances[0].hostName}:${personelInstances[0].port.$}`;
    logger.info(`Instance of disease-svc is running on ${diseaseHostname}`);
    logger.info(`Instance of personel-svc is running on ${personelHostname}`);
    //ask 
    let count = illnesses.length;
    if (illnesses) {
        logger.info('Looking for drugs that cures diseases: ' + illnessIds);
        let n = 0;
        let fail = false;
        illnesses.forEach(id => {
            axios.get(`${diseaseHostname}/disease/${id}`)
                .then(function (response) {
                    if (!response || !response.data) {
                        res.status(400).send(`Error: disease with id ${id} does not exist`);
                        logger.error(`Error: disease with id ${id} does not exist`);
                        fail = true;
                    }
                    else {
                        drugs[response.data.id] = response.data.cures;
                    }
                })
                .catch(function (error) {
                    // handle error
                    logger.error(error);
                    res.status(400).send(error);
                })
                .finally(function () {
                    n = n + 1;
                    if (n == count && !fail) {
                        axios.get(`${personelHostname}/doctors`).then((res)=>{
                            if (res && res.data && res.data[0]){
                                logger.info(`Doctor ${res.data[0].firstname} ${res.data[0].lastname} prescribed ${drugs}`)
                            }
                        }).catch(e => logger.warn('Could not verify the doctor'))
                        .finally(()=>{})
                        res.status(200).send(drugs);
                    }
                });
        });
    }
    else {
        res.status(400).send('Error: no disease ids were specified');
    }
}

function getAll(res, logger, drug) {
    drug.find().then((resp) => {
        logger.info('Fetching all drugs from the database');
        res.status(200).send(resp);
    }).catch(err => {
        console.log(err);
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