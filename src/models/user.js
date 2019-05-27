const mongoose = require('mongoose');
const validator = require('validator');

const User =mongoose.model('User',{
    name:{
        type:String,
        required:true,
        trim : true
    },
    password:{
        type:String,
        minlength:7,
        trim : true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password" .');
            }
        }
    },
    email:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                    throw new Error('Email is invalid');
            }
        }
    },
    age:{
        type:Number,
        required:true,
        validate(value){
            if(value<1){
                throw new Error('Age must be a positive number');
            }
        }
    }
});

module.exports = User;