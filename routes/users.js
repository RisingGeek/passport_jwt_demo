var express = require('express');
var router = express.Router();
const userHelper = require('../db/helpers/userHelper');
const jwt = require('jsonwebtoken');

const passport = require('passport')
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret key'
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json('hooray! authorized');
});

router.post('/signup', function(req, res, next) {
  if(!req.body.email || !req.body.password) {
    res.status(401).json({message: "Please provide email and password"});
  }
  if(req.body.password < 8) {
    res.status(401).json({message: "Password length should be greater than 8"});
  }
  userHelper.addUser({email: req.body.email, password: req.body.password}).then(response => {
    res.json({message: "Successfully added user"});
  }).catch(err => {
    res.status(401).json({message: err});
  });
});

router.post('/login', function(req, res, next) {
  userHelper.getUserByEmail(req.body.email).then(user => {
    if(!user) {
      res.status(401).json({message: 'Email not found'});
    }
    // userHelper.verifyPassword(req.body.password).then()
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
