const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const userHelper = require('./db/helpers/userHelper');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret key'
};

module.exports = function(passport) {
    const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
        userHelper.getUserById(jwt_payload.id).then(user => {
            if(user) {
                next(null, user);
            }
            else {
                next(null, false);
            }
        });
    });
    
    passport.use(strategy);
}