import {Express} from 'express';
import { PassportStatic } from 'passport';

export function createLoginService(app: Express, passport: PassportStatic) {
  app.post('/login', 
    passport.authenticate('local', {
      failureRedirect: '/login/failure'
    }),
    (req, res) => res.send()
  );

  app.get('/login/failure', (req, res) => {
    res.status(401).send();
  });

  app.get('/logout',
    (req, res) => {
      req.logOut(err => {
        res.send();
      });
  });
}