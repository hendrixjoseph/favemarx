import {Express, Request, RequestHandler, Response} from 'express';
import { UserDb } from './mysql/user.db.js';
import { Registration } from 'common/registration.js';

export function createRegistrationService(app: Express, userDb: UserDb) {
  app.post('/register', (req: Request<any, any, Registration>, res) => {
    userDb.createUser(req.body, succeeded => res.send());
  });
}