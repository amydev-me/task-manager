const mongoose = require('mongoose');
const validator = require('validator');
//Set Database Name
const databaseName = 'task-manager-api';

// Connection URL
const url = 'mongodb://localhost:27017/'+ databaseName;


// Connet to the Database
mongoose.connect(url,{
    useNewUrlParser:true,
    useCreateIndex:true
});

// Create User Model with mongoose
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

// Create Task Model with mongoose
const Task = mongoose.model('Task', {
    description:{
        type:String,
        trim:true,
        required:true
    },
    completed : {
        type:Boolean,
        default:false
    }
});

const task = new Task({
    description :"Do homework",
    completed :false
});

task.save().then(()=>{
    console.log(task);
}).catch((e)=>{
    console.log(e);
});

// // Create User Instance
// const user = new User({name:'aap',email:'aap@gmail.com',age:29,password:'password123'});

// // Store data into the user document
// user.save().then((result)=>{
//     console.log(result);
// }).catch((e)=>{
//     console.log(e);
// });