const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret key'
};

const strategy = new JwtStrategy(opts, (jwt_payload, next) => {
  const user=null;
  next(null, user);
});

passport.use(strategy);