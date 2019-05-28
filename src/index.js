const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.port || 3000

app.use(express.json());
 
app.post('/users', async (req, res) => {
    const user = new User(req.body);
    try{
        await user.save();
        res.status(201).send(user);
    }catch(e){
        res.status(500).send();
    }
});

app.get('/users',(req, res)=>{
    User.find({}).then((users)=>{
        res.status(200).send(users)
    }).catch((e)=>{
        res.status(500).send();
    });
});

app.get('/users/:id',(req, res)=>{
    const _id =req.params.id;
    // return res.send(_id);
    User.findById(_id).then((user)=>{
        if(!user){
            return res.send(404);
        }
        res.status(200).send(user);
    }).catch((e)=>{
        res.status(500).send();
    })
});

app.post('/tasks',(req, res)=>{
    const task = new Task(req.body);
    
    task.save().then((result)=>{
        res.status(201).send(task);
    }).catch((e)=>{
        res.status(400).send();
    });
})

app.get('/tasks',(req, res)=>{
    Task.find({}).then((tasks)=>{
        res.send(tasks);
    }).catch((e)=>{
        res.status(500).send();
    });
});

app.get('/tasks/:id',(req,res)=>{
    const _id = req.params.id;
    Task.findById(_id).then((task)=>{
        if(task){
            return res.send(task);
        }
        res.status(404).send();
    }).catch((e)=>{
        res.send(500).send();
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));