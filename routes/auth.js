const { User } =  require('./../models/user')
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    let user  = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).send('Email yoki parol noto\'g\'ri');
    }
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if(!isValidPassword){
        return res.status(400).send('Email yoki parol noto\'g\'ri');   
    }
    const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, config.get('jwtPrivateKey'));
    res.header('x-auth-token', token).send(true);
});

const validate = (req) => {
    const schema = {
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;