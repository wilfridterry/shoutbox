var express = require('express');
const Entry = require('../models/entry');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('post', { title: 'POST' });
});

router.post('/', (req, res, next) => {
    const data = req.body.entry;
    const user = res.locals.user;
    const username = user ? user.name : null;

    const entry = new Entry({
        username: username,
        title: data.title,
        body: data.body
    });

    entry.save((err) => {
        if (err) return next(err);

        res.redirect('/');
    });
});

module.exports = router;