const mongoose = require('mongoose')

const drugSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        required: true
    },
    amount: {
        type: String,
        required: false,
        default: '1'
    }
})

const drug = mongoose.model('drug', drugSchema)

module.exports = { drug }