import {Express, Request, RequestHandler, Response} from 'express';
import UserDb from './mysql/user.db.js';
import { Registration } from 'common/registration.js';

export default function createRegistrationService(app: Express, userDb: UserDb) {
  app.post('/register', (req: Request<any, any, Registration>, res) => {
    userDb.createUser(req.body, succeeded => res.send());
  });

  app.get('/verify/:email/:hash', (req, res) => {
    userDb.verifyUser(req.params.email, req.params.hash, success => {
      if (success) {
        res.redirect('/');
      } else {
        res.status(404).send('Bad verification link.');
      }
    })
  });

  app.get('/verificationLink/:email', (req, res) => {
    userDb.createVerificationLink(req.params.email, link => {
      if (link) {
        let tag = '<a href="' + link + '">' + link + '</a>';
        res.send(tag);
      } else {
        res.status(404).send();
      }
    });
  })
}