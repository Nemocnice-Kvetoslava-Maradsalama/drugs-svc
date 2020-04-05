'use strict';

const controller = require('./controller');

module.exports = function(app) {
    app.route('/getAll').get(controller.getAll);
    app.route('/createDrug/:id/:name/:amount').get(controller.createDrug);
    app.route('/readDrug/:id').get(controller.readDrug);
    app.route('/updateDrug/:amount/:id').get(controller.updateDrugAmount);
    app.route('/deleteDrug/:id').get(controller.deleteDrug);
};