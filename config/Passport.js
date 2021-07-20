import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserModel from '../src/model/User.model.js';
import PasswordUtils from '../src/lib/PasswordUtils.js';

import fs from "fs";
import path from "path"
import UserModel from '../src/model/User.model.js';

// const pathToKey= path.join(__dirname, "..", "id_rsa_pub.pem" )
// const PUB_KEY= fs.readFileSync(pathToKey, "utf-8")


// const options={

// }

// export const passport=(pass)=>{

// }











/*
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */


//local strategy
const verifyCallback = (username, password, done) => {
  UserModel.findOne({  username })
    .then((user) => {
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

// END of LocalStrategy

