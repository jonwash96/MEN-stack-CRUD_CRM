const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name:String,
    age:Number,
    update:Number
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer;