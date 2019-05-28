require('../src/db/mongoose');
const Task = require('../src/models/task');

const deleteTaskAndCount = async (id) =>{
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed:false});
    return count;
}

deleteTaskAndCount("5cea9e4437bcf8196351ab2c").then((count)=>{
    console.log(count);
}).catch((e)=>{
    console.log(e);
});