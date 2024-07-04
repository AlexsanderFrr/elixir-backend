// config/passportConfig.js
const { Strategy, ExtractJwt } = require('passport-jwt');
const { Usuario } = require('../models');
const SECRET_KEY = process.env.SECRET_KEY;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};

const strategy = new Strategy(options, async (payload, done) => {
  try {
    const user = await Usuario.findByPk(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});

const configurePassport = (passport) => {
  passport.use(strategy);
};

module.exports = configurePassport;
