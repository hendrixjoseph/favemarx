import { PassportStatic } from "passport";
import express from 'express';
import session from 'express-session';

export function initalizeExpress(passport: PassportStatic) {
  const app = express();
  app.use(express.json());
  app.use(session({ 
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  return app;
}