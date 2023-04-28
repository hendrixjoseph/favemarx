import { createLoginService } from './modules/login.js';
import { initializePassport } from './modules/passport.init.js';
import { initalizeEndpoints } from './modules/endpoints.js';
import { initalizeExpress } from './modules/express.init.js';

const passport = initializePassport();
const app = initalizeExpress(passport);

createLoginService(app, passport);
initalizeEndpoints(app);

app.listen(8080, ():void => {
  console.log(`Server Running here 👉 http://localhost:8080`);
});