const router = require('express').Router();

router.get('/register', [], (req, res, next) => {
    return res.render('register', { title: 'Register' });
});

router.post('/register', [], (req, res, next) => {

});

module.exports = router;