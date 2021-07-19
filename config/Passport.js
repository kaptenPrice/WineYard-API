import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
// import DBConfiguration from './DBConfiguration';
import UserModel from '../src/model/User.model.js';
// import { passwordValidator } from '../src/lib/PasswordUtils';
import PasswordUtils from '../src/lib/PasswordUtils.js';

const verifyCallback = (username, password, done) => {
  UserModel.findOne({ username: username })
    .then((user) => {
      console.log(user._id);
      if (!user) {
        return done(nul, false);
      }
      const isValid = PasswordUtils.passwordValidator(
        password,
        user.hash,
        user.salt
      );
      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((error) => {
      done(error.message);
    });
};

const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  UserModel.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error);
    });
});
