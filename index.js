'use strict';

const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// Configure passport
passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log(username);
    return done(null, username);
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user, done) => {
    done(null, user);
});

const app = express();

const cookieParser = require('cookie-parser')
const session = require("express-session");
const bodyParser = require('body-parser');

app.use(express.static('static'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

// App
app.post('/login',
  passport.authenticate('local', { successRedirect: '/success',
                                   failureRedirect: '/failure'
                                 })
);

app.get('/success',
    (req, res) => {
      console.log(req);
      res.send('success ' + req.user);
});


app.get('/', (req, res) => {
  console.log(req);
  res.send('Hello World');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);