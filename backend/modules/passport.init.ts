import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';

export function initializePassport() {
  passport.use(new LocalStrategy(
    (username, password, done) => {
      return done(null, {name: username, id: 1});
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