import { createLoginService } from './modules/login.js';
import { initializePassport } from './modules/passport.init.js';
import { initalizeEndpoints } from './modules/endpoints.js';
import { initalizeExpress } from './modules/express.init.js';
import { createRegistrationService } from './modules/register.js';
import { UserDb } from './modules/mysql/user.db.js';
import { getMySqlPool } from './modules/mysql/mysql.init.js';

const userDb = new UserDb(getMySqlPool())
const passport = initializePassport(userDb);
const app = initalizeExpress(passport);

createLoginService(app, passport);
createRegistrationService(app, userDb);
initalizeEndpoints(app);

app.listen(3000, ():void => {
  console.log(`Server Running here 👉 http://localhost:3000`);
});