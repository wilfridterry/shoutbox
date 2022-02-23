const express = require('express');
const auth = require('basic-auth');
const User = require('../models/users');
const Entry = require('../models/entry');
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

router.get('/entries/:page?', [page(Entry.count)], (req, res, next) => {
    const page = req.page;

    Entry.getRange(page.from, page.to, (err, entries) => {
        if (err) return next(err);
        res.format({
            json: () => {
                res.send(entries);
            },
            xml: () => {
                res.render('entries/x m l', { entries: entries });
            }
        });
    });
});

router.post('entries', (req, res, next) => {
    console.log('entries api');
});

module.exports = {
    router: router,
    auth: apiAuth
};