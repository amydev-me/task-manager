const express = require('express');
const router  = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');

router.post('/tasks', auth, async (req, res)=>{
    // const task = new Task(req.body);    
    const task =  new Task({
        ...req.body,
        owner:req.user._id});
    try{
        await task.save();
        res.status(201).send(task);    
    }catch(e){
        res.status(400).send(e);
    }
});

router.get('/tasks', auth , async (req, res)=>{

    await req.user.populate('tasks').execPopulate();
    res.send(req.user.tasks);
    // try{
    //     const tasks = await Task.find({owner:req.user._id});
    //     res.send(tasks);

    // }catch(e){
    //     res.status(500).send();
    // }
});

router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id;

    try{
        // const task = await Task.findById(_id);
        const task = await Task.findOne({_id,owner:req.user._id});
        if(task){
            return res.send(task);
        }
        return res.status(404).send();
    }catch(e){
        res.status(500).send();
    }
});

router.patch('/tasks/:id', auth ,async (req,res)=>{
    const _id = req.params.id;

    const updates = Object.keys(req.body);
    const allowUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates!'});
    }

    try{
        const task = await Task.findOne({_id,owner:auth.user._id});
        if(!task){
            res.status(404).send('Task not found');
        }
        
        updates.forEach((update)=> task[update]=req.body[update]);
        await task.save();
        res.send(task);
                
    }catch(e){
        res.status(500).send();
    }
});

router.delete('/tasks/:id',async(req,res)=>{
    const _id = req.params.id;

    try{
        const task = await Task.findByIdAndDelete(_id);

        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch{}
});

module.exports = router;