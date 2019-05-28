const mongoose = require('mongoose');
const validator = require('validator');
//Set Database Name
const databaseName = 'task-manager-api';

// Connection URL
const url = 'mongodb://localhost:27017/'+ databaseName;


// Connet to the Database
mongoose.connect(url,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
});