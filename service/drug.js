var request = require('request');

var pgp = require('pg-promise')(/* options */)
var db = pgp('postgres://postgres:postgres@localhost:5555/testdb')

// MOCK of DISEASE-SVC
const giveMeDrugIdThatCuresThisIllness = (drugId) => {
  console.log(drugId % 2)
    if (drugId % 2 == 0) {
      return 10
    }
    else {
      return 15
    }
}
var drug = {
   create: function(req, res, next) {
      db.none('INSERT INTO drugs(id, drugName, amount) VALUES(${id}, ${drug.name}, $<drug.amount>)', {
        id: req.params.id,
        drug: {name: req.params.name, amount: req.params.amount}
      })
        .then(() => res.json('200'))
        .catch(e => res.json(e));
    },
    read: async function(req, res) {
      try {
        const users = await db.any('SELECT * FROM drugs WHERE id = $1', req.params.id);
        res.json(users)
      } 
      catch(e) {
        res.json(result);
      }
    },
    update: async function(req, res) {
      try {
        db.none('UPDATE drugs SET amount = $1 WHERE id = $2', [req.params.amount, req.params.id]);
        res.json('200')
      } 
      catch(e) {
        res.json('500');
      }
    },
    delete: function(req,res) {
      db.result('DELETE FROM drugs WHERE id = $1', req.params.id)
        .then(result => res.json(result.rowCount))
        .catch(e => res.json(e))
    },
    suggest: function(req,res) {
      let drugs = {}
      let illnesses = req.params.illnessIds.split(',')
      if (illnesses){
         illnesses.forEach(illness => {
          let potentialDrugs = giveMeDrugIdThatCuresThisIllness(illness)
          // TODO: check drug availability
          // TODO: call Personal -> ask for access level
          drugs[illness] = potentialDrugs
        });
      }
      res.json(drugs)
    }
};

module.exports = drug;