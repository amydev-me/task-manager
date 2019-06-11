const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
    description:{
        type:String,
        trim:true,
        required:true
    },
    completed : {
        type:Boolean,
        default:false
    },
    owner:{
        type :mongoose.Schema.Types.ObjectId,
        ref:'Owner'
    }
});

module.exports = Task;