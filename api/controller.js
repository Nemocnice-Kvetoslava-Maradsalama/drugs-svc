'use strict';

var drug = require('../service/drug');

var controllers = {
   getAll: async function(req, res) {
        // var result = ''
        // db.none('INSERT INTO drugs(id, drugName, amount) VALUES(${id}, ${drug.name}, $<name.amount>)', {
        //     id: 5,
        //     drug: {name: 'Coldrex', amount: 14}
        // });
        // try {
        //     const drugs = await db.any('SELECT * FROM drugs WHERE id = $1', 30);
        //     console.log(drugs)
        //     res.json(drugs)
        // } 
        // catch(e) {
        //     // error
        //     console.log(e)
        //     var aboutInfo = {
        //         name: properties.name,
        //         version: properties.version
        //     }
        //     res.json(result);
        // }
   },
    createDrug: function(req, res) {
        drug.create(req, res, (err, dist) => err ? req.send(err) : res.json(dist));
    },
    readDrug: function(req,res) {
        drug.read(req,res, (err,dist) => err ? req.send(err) : res.json(dist))
    },
    updateDrugAmount: function(req, res) {
        drug.update(req,res, (err,dist) => err ? req.send(err) : req.json(dist))
    },
    deleteDrug: function(req, res) {
        drug.delete(req,res,(err,dist) => err ? req.send(err) : req.json(dist))
    },
    suggestPrescription: function(req, res) {
        drug.suggest(req, res, (err,dist) => err ? req.send(err) : req.json(dist))
    }
};

module.exports = controllers;