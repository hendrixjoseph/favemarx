import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { UserDb } from "./mysql/user.db.js";

export function initializePassport(userDb: UserDb) {
  passport.use(new LocalStrategy(
    (email, password, done) => {
      userDb.validateUser(email, password, valid => {
        if (valid) {
          done(null, {email: email, id: valid.id});
        } else {
          done(null, false);
        }
      })
    }
  ));
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
  });

  return passport;
}