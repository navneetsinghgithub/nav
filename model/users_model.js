const mongoose = require('mongoose')
const usersschema = new mongoose.Schema({
    name:{type:String},
    lastname:{type:String},
    contact:{type:Number},
    email:{type:String},
    password:{type:String},
    image:{type:String},
    token:{type:String},
    loginTime:{type:String},
    otp:{type:Number},

},{timestamps:true})

module.exports = mongoose.model('users',usersschema);