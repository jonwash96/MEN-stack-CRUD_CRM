const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name:String,
    age:Number,
    updated:Number
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer;