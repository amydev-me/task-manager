const express = require('express');
const router  = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try{
        await user.save();
        await user.generateAuthToken();

        res.status(201).send({user,token});
    }catch(e){
        res.status(500).send(e);
    }
});

router.post('/users/login', async (req, res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user,token});
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/users/logout',auth,async (req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token;
        });
        await req.user.save();

        res.status(200).send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/users/me',auth, async (req, res)=>{
    res.send(req.user);
});

router.get('/users',auth,async (req, res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(e){
        res.status(500).send();
    }
});

router.get('/users/:id',async (req, res)=>{
    const _id =req.params.id;
    try
    {
        const user = await User.findById(_id);

        if(user){
            return res.status(404).send();
        }

        return res.status(200).send(user);        
    }
    catch(e){
        res.status(500).send();
    }
});

router.patch('/users/:id',async  (req, res)=>{
    const updates = Object.keys(req.body);
    const allowUpdates = ['name', 'email' , 'password' , 'age'];
    const isValidOperation = updates.every((update) => allowUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates!'});
    }
 
    try{
        // const user =await User.findByIdAndUpdate(req.params.id, req.body , { new:true, runValidators:true});

        const user = await User.findById(req.params.id);

        updates.forEach((update)=> user[update] =req.body[update]);

        await user.save();

        if(!user){
            return res.status(404).send();
        }
 
        res.send(user);

    }catch(e){
        res.status(500).send();
    }
});

router.delete('/users/:id',async (req,res) =>{
    const _id = req.params.id;

    try{
        const user = await User.findByIdAndDelete(_id);
        if(!user){
            return res.status(404).send();
        }
        return res.send(user);
    }catch(e){
        res.status(500).send();
    }
});

module.exports = router;