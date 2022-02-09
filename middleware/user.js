const User = require('../models/users');

module.exports = async (req, res, next) => {
    const uid = req.session.uid;
    if (!uid) return next();

    try {
        const user = await User.get(uid);
        req.user = res.locals.user = user;
        next();
    } catch(err) {
        next(err);
    }
};