const express = require('express');
const bodyParser = require('body-parser');
const Eureka = require('eureka-js-client').Eureka;
const axios = require('axios');
const logger = require('./logger/logger').logger
const getPrescription = require('./controller/controller').getPrescription
const getAll = require('./controller/controller').getAll
const getDrugById = require('./controller/controller').getDrugById
const getDrugByName = require('./controller/controller').getDrugByName
const updateDrug = require('./controller/controller').updateDrug
const deleteDrug = require('./controller/controller').deleteDrug
const createDrug = require('./controller/controller').createDrug
const os = require('os')
const PORT = process.env.PORT || 5000;
const EUREKA_PORT = process.env.EUREKA_PORT || 8761
const EUREKA_HOST = process.env.EUREKA_HOST || '172.28.0.2'
const drug = require('./models/drugModel.js').drug
const app = express();
const fetch = require('node-fetch')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const getNetworkIPAddress = () => {
    const interfaces = os.networkInterfaces();
    const eth0Interfaces = interfaces['eth0'];
    if (eth0Interfaces.length > 0) {
        return eth0Interfaces[0].address;
    } else {
        return '127.0.0.1';
    }
};

let client = null

app.get('/drug', (req, res) => getAll(res, logger, drug))
app.get('/drug/byId/:id', (req,res) => getDrugById(req, res, logger, drug))
app.get('/drug/byName/:name', (req,res) => getDrugByName(req, res, logger, drug))
app.patch('/drug/updateById/:id/:availability/:amount', (req,res)=> updateDrug(req, res, logger, drug))
app.post('/drug/deleteById/:id', (req,res)=>deleteDrug(req, res, logger, drug))
app.post('/drug/:name/:availability', (req,res) => createDrug(req, res, logger, drug))
app.get('/drug/suggestPrescription/:illnessIds', (req,res)=> getPrescription(req, res, logger, client, axios))

const mongoose = require('mongoose');
const db_uri = 'mongodb://mongo:27017/drugService'

mongoose.connect(db_uri).then(() => {
    logger.info('Connected to MongoDB on ' + db_uri)
    logger.info('Listening on port: ' + PORT);
    app.listen(PORT);
    logger.info('Adding data to database')
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
    logger.info('Registering with Eureka Server')
    client = new Eureka({
        instance: {
            app: 'drug-svc',
            instanceId: 'one1',
            hostName: 'drug-svc',
            ipAddr: getNetworkIPAddress(),
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
        logger.info(error || 'Eureka Started!');
        const diseaseInstances = client.getInstancesByAppId('PERSONNEL-SVC');
        const personnelHostname = `http://${diseaseInstances[0].ipAddr}:${diseaseInstances[0].port.$}`
        logger.info('Connected to PERSONNEL-SVC running on ' + personnelHostname)
        const requestUrl = personnelHostname + '/auth/login'
        axios({
            method: 'post',
            url: requestUrl,
            data: {
                username: 'testuser',
                password: 'testpassword'
            }
        }).then((resp) => {
            logger.info('Successfully recieved access_token from PERSONNEL-SVC: ' + String(resp.data.access_token).slice(0,14) + '...')
        }).catch((e)=>{
            logger.error(e)
        })
    });
}).catch(e=>logger.error(e))