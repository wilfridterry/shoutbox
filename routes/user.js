const User = require('../models/users');

const router = require('express').Router();

router.get('/register', [], (req, res, next) => {
    return res.render('register', { title: 'Register' });
});

router.post('/register', [], (req, res, next) => {
    const data = req.body.user;

    User.getByName(data.name, (err, user) => {
        if (err) return next(err);

        if (user.id) {
            res.error('Username already taken!');
            res.redirect('back');
        } else {
            user = new User({
                name: data.name,
                pass: data.pass
            });
            user.save((err) => {
                if (err) return next(err);
                req.session.uid = user.id;
                res.redirect('/');
            });
        }
    });
});

router.get('/login', [], (req, res, next) => {
    res.render('login', { title: 'Login' });
});

router.post('/login', [], (req, res, next) => {
    const data = req.body.user;

    User.authenticate(data.name, data.pass, (err, user) => {
        if (err) throw err;

        if (user) {
            req.session.uid = user.id;
            res.redirect('/');
        } else {
            res.error('Sorry! Invalid credentials.');
            res.redirect('back');
        }
    });
});

router.get('/logout', [], (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

module.exports = router;