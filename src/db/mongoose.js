const mongoose = require('mongoose');
const validator = require('validator');

// Connection URL
const url = process.env.DB_HOST;


// Connet to the Database
mongoose.connect(url,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
});