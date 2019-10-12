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
    res.status(400).json({message: "Please provide email and password"});
  }
  if(req.body.password < 8) {
    res.status(400).json({message: "Password length should be greater than 8"});
  }
  userHelper.addUser({email: req.body.email, password: req.body.password}).then(response => {
    userHelper.generateToken(response._id, req.headers).then(msg => {
      res.json(msg);
    }).catch(err => {
      res.status(500).json(err);
    });
  }).catch(err => {
    res.status(401).json({message: err});
  });
});

router.post('/login', function(req, res, next) {
  if(!req.body.email || !req.body.password) {
    res.status(400).json({message: "Please provide email and password"})
  }
  if(req.body.password < 8) {
    res.status(401).json({message: "Password length should be greater than 8"});
  }
  userHelper.checkPassword({email: req.body.email, password: req.body.password}).then(user => {
    let payload = { id: user.id};
    let token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({message: 'ok', token: token});
  }).catch(err => {
    res.status(401).json(err);
  });
});

router.get('/confirmation/:token', function(req, res, next) {
  userHelper.verifyToken(req.params.token, req.query.id).then(response => {
    res.json(response);
  }).catch(err => {
    res.status(401).json(err);
  });
});

router.post('/forget-password', function(req, res, next) {
  if(!req.body.email) {
    res.status(400).json({message: "Please provide email"});
  }
  userHelper.forgetPassword(req.body.email, req.headers).then(response => {
    res.json(response);
  }).catch(err => {
    res.json(err);
  });
});

module.exports = router;
