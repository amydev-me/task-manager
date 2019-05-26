const {MongoClient,ObjectID} = require('mongodb');
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'task-manager';

// Create a new MongoClient
const client = new MongoClient(url,{useNewUrlParser:true});

// Use connect method to connect to the Server
client.connect(function(err) {
    assert.equal(null, err); 
    // console.log("Connected successfully to server");

    const db = client.db(dbName);

    db.collection('tasks').deleteOne({description:'appoinment'}).then((result)=>{
        console.log(result.deletedCount);
    }).catch((error)=>{
        console.log(error);
    });

    client.close();
});