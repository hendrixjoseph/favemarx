import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { UserDb } from "./mysql/user.db.js";
import { getMySqlPool } from "./mysql/mysql.init.js";

export function initializePassport() {
  const userDb = new UserDb(getMySqlPool());

  passport.use(new LocalStrategy(
    (username, password, done) => {
      userDb.validateUser(username, password, valid => {
        if (valid) {
          done(null, {name: username, id: 1});
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