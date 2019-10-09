var express = require('express');
var router = express.Router();
const userHelper = require('../db/helpers/userHelper');
const jwt = require('jsonwebtoken');
const { jwtOptions, passport } = require('../passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json('hooray! See without token');
});

router.post('/login', function(req, res, next) {
  userHelper.getUserByName(req.body.username).then(user => {
    if(req.body.password === 'pass') {
      let payload = { id: user.id};
      let token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({message: 'ok', token: token});
    }
    else {
      res.status(401).json({message: 'password does not match'});
    }
  });
});

module.exports = router;
