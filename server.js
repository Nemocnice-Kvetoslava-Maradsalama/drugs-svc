const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Eureka = require('eureka-js-client').Eureka;


const PORT = process.env.PORT || 5000;
const EUREKA_PORT = process.env.EUREKA_PORT || 8761
const EUREKA_HOST = process.env.EUREKA_HOST || '172.28.0.2'
const app = express();
const fetch = require("node-fetch")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(express.static(__dirname + '/public'));
// console.log('Listening on port: ' + PORT);
// app.listen(PORT);

const drug = require('./drugModel.js').drug
let client = null
// get all
app.get('/drug', (req, res) => {
    drug.find().then((resp)=>{
        console.log(resp)
        res.status(200).send(resp)
    }).catch(err => {
        console.log(err)
        res.status(400).send(err)})
})

//get by id
app.get('/drug/byId/:id', (req,res) => {
    const { id } = req.params
    drug.findById(id).then(resp => res.status(200).send(resp)).catch(err => res.status(400).send(err))
})

//get by name
app.get('/drug/byName/:name', (req,res) => {
    const {name} = req.params
    drug.findOne({name: name}).then(resp => res.status(200).send(resp)).catch(err => res.status(400).send(err))
})

//update
app.patch('/drug/updateById/:id/:availability/:amount', (req,res)=> {
    const { id, availability, amount } = req.params;
    drug.findOneAndUpdate({_id: id}, {available: availability, amount: amount}).then((dr) => res.status(200).send(dr))
    .catch((err) => res.status(400).send(err));
})

//delete
app.post('/drug/deleteById/:id', (req,res)=>{
    const { id } = req.params
    drug.findByIdAndDelete({_id: id}).then(resp => res.status(200).send(resp)).catch(err => res.status(400).send(err))
})

//create one
app.post('/drug/:name/:availability', (req,res) => {
    const {name, availability} = req.params
    drug.create({
        name: name,
        available: true
    }).then((savedDrug)=> res.status(201).send(savedDrug)).catch(err=>{
        console.log(err)
        res.status(400).send(err)});
})

//suggest prescription
app.get('/drug/suggestPrescription/:illnessIds', (req,res)=>{
    const {illnessIds} = req.params
    let drugs = {}
      let illnesses = illnessIds.split(',')
        const instances = client.getInstancesByAppId('DISEASE-SVC');
        const hostname = `http:// ${instances[0].hostName}:${instances[0].port.$}`
        // ask 
        // if (illnessIds){
        //     illnessIds.forEach(id=>{
        //         //ask for disease for this id
        //         // fetch(hostname).then(disease => storage.push(disease.Id))
        //     })
        // }
        drug.find().then((drugs)=>{
            ids = []
            drugs.forEach(drug => ids.push(drug._id))
            res.status(201).send(ids)
        }).catch(err => res.status(400).send(err))
})

const mongoose = require('mongoose');
const db_uri = 'mongodb://mongo:27017/drugService'

mongoose.connect(db_uri).then(() => {
    console.log('Listening on port: ' + PORT);
    app.listen(PORT);
    drug.create({
        name: "Forlax",
        available: true,
        amount: '21'
    })
    drug.create({
        name: "Nalgesin S",
        available: true,
        amount: '32'
    })
    drug.create({
        name: "Paralen",
        available: true,
        amount: '11'
    })
    client = new Eureka({
        instance: {
            app: 'drug-svc',
            instanceId: 'one1',
            hostName: 'localhost',
            ipAddr: '127.0.0.1',
            port: {
                '$': PORT,
                '@enabled': true,
            },
            vipAddress: 'drug-svc',
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
            registerWithEureka: true,
            fetchRegistry: true
        },
        eureka: {
            host: EUREKA_HOST,
            port: EUREKA_PORT,
            servicePath: '/eureka/apps',
        },
    });
    client.start((error) => {
        console.log(error || 'Eureka Started!');
    });

})