var express = require('express');
const Entry = require('../models/entry');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  Entry.getRange(0, -1, (err, entries) => {
    if (err) return next(err);

    res.render('index', {
      title: 'Entries',
      entries: entries
    });
    
  });
});

module.exports = router;
