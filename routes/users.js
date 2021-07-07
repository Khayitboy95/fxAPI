const { User, validate } =  require('./../models/user')
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const passwordComplexity = require('joi-password-complexity');
const bcrypt = require('bcrypt');


router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    let user  = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).send('Mavjud bo\'lgan foydalanuvchi');
    }
    const salt = await bcrypt.genSalt();
    const pass = req.body.password;
    const pwdHash = await bcrypt.hash(pass, salt);

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: pwdHash
    });
    await user.save();
    res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;