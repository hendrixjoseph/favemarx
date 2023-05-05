import {Express} from 'express';
import { PassportStatic } from 'passport';

export default function createLoginService(app: Express, passport: PassportStatic) {
  app.post('/login', 
    passport.authenticate('local', {}),
    (req, res) => {
      res.send()
    }
  );

  app.get('/logout',
    (req, res) => {
      req.logOut(err => {
        res.send();
      });
  });
}