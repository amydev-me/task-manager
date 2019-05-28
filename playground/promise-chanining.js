require('../src/db/mongoose');
// const User = require('../src/models/user');
const Task = require('../src/models/task');

// User.findByIdAndUpdate('5cea9b900b302118f0e3f346',{age:30}).then((user)=>{
//     console.log(user);
//     return User.countDocuments({age:30});
// }).then((result)=>{
//     console.log(result);
// }).catch((e)=>{
//     console.log(e);
// });


Task.findByIdAndDelete('5cec0589d8c75f217348a07e').then((task)=>{
    console.log(task);
    return Task.countDocuments({completed:false});
}).then((result)=>{
    console.log(result);
}).catch((e)=>{
    console.log(e);
});