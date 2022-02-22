const express = require('express');
const auth = require('basic-auth');
const User = require('../models/users');

var router = express.Router();


const apiAuth = (req, res, next) => {
    const { name, pass } = auth(req);
    User.authenticate(name, pass, (err, user) => {
        if (user) req.remoteUser = user;
        next(err);
    });
};

router.get('/users/:id', async (req, res, next) => {
    try {
        const user = await User.get(req.params.id);
        console.log(user);
        if (!user.id) return res.sendStatus(404);
        res.json(user);

    } catch(err) {
        next(err)
    }
});

router.get('/entries/:page?', (req, res, next) => {

});

router.post('entries', (req, res, next) => {
    console.log('entries api');
});

module.exports = {
    router: router,
    auth: apiAuth
};