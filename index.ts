import express, {Request, RequestHandler, Response} from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

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

const app = express();
app.use(express.json());
app.use(session({ 
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const endpoint = '/websites';
const endpointWithId = '/websites/:id';

const forOhForBlocker: RequestHandler = (req, res, next) => req.user ? next() : res.status(404).send();

export interface Website {
  id?: number,
  name: string,
  url: string,
  date: Date
}

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

app.get(endpoint,
  forOhForBlocker, 
  (req: Request, res: Response<Website[]>) => {
    let websites: Website[] = [
      {id: 0, name: "Google", url: "https://www.google.com", date: new Date('2018-03-26')},
      {id: 1, name: "Amazon", url: "https://www.amazon.com", date: new Date('2019-12-28')}
    ];

    res.send(websites);
});

app.post(endpoint,
  forOhForBlocker,
  (req: Request<any, any, Website>, res: Response<Website>) => {
  let website = req.body;
  website.id = new Date().getTime();
  res.send(website);
});

app.put(endpointWithId,
  forOhForBlocker,
  (req: Request<{id: string}, any, Website>, res: Response<Website>) => {
  res.send(req.body);
});

app.delete(endpointWithId,
  forOhForBlocker,
  (req, res) => {
  res.send();
});

app.listen(8080, ():void => {
  console.log(`Server Running here 👉 http://localhost:8080`);
});