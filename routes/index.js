var express = require('express');
var router = express.Router();
const User = require('../db/models/Users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  res.send({'key':'value'})
});

module.exports = router;
