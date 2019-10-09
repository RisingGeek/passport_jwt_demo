var express = require('express');
var router = express.Router();
const userHelper = require('../db/helpers/userHelper');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  userHelper.login();
  res.render('login');
});

router.post('/login', function(req, res, next) {
  res.send({'key':'value'})
});

module.exports = router;
