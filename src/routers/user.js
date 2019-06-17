const express = require('express');
const router  = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer  = require('multer');
const sharp = require('sharp');
const {sendWelcomeEmail,sendCancellationEmail} = require('../emails/account');

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try{
        await user.save();
        sendWelcomeEmail(user.email,user.name);
        const token =await user.generateAuthToken();

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

        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post('/users/logoutall',auth,async(req, res)=>{
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
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

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) =>  req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth,async (req,res) =>{
    try
    {
        await req.user.remove();
        sendCancellationEmail(req.user.email, req.user.name);
        res.status(200).send(req.user);
    }catch(error){
        res.status(500).send(error.message);
    }
});


const upload = multer({ 
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            callback(new Error('Please upload an image'))
        }

        callback(null,true);
    }
});

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize(250,250).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
});

router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar = null;
    await req.user.save();
    res.send();
});

router.get('/users/:id/avatar',async(req, res)=>{
    try {
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar){
            throw new Error();
        }
        res.set('Content-Type','image/png');
        res.send(user.avatar);
    } catch (error) {
        
    }
});


module.exports = router;