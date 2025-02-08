const mongoose = require('mongoose');
const  validator  = require('validator');
 const userRole = require('../utils/roles')
const userSchema = mongoose.Schema({
    firstName: {
        type:String,
        required: true
    },
    lastName: {
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique:true,
        validate:[validator.isEmail,'filed must be a valid email address']
    },
    password:{
        type:String,
        required:true
    },token:{
        type:String
    },
    role:{
        type:String,
        enum:[userRole.USER,userRole.ADMIN,userRole.MANGER],
        default:userRole.USER
    },
    avatar:{
        type:String,
        default:'uploads/profile.png'
    }
})


const user = mongoose.model('User', userSchema);
module.exports = user;