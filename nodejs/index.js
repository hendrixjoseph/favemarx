'use strict';

const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit : 100,
  host: "favemarx_db",
  user: "favemarx_web",
  password: "password",
  database: "favemarx"
});

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// Configure passport
passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log(username);

    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }

      connection.query("SELECT id, password_hash FROM user WHERE email = ?", [username], (err2, result) => {
        if (err2) {
          throw err2
        }

        if(result.length === 1) {
          bcrypt.compare(password, result[0].password_hash, (err, found) => {
            if(found) {
              return done(null, {name: username, id: result[0].id});
            } else {
              // bad password
              return done(null, false);
            }
          });
        } else {
          // no user found
          return done(null, false);
        }
      });
    });
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

app.set('view engine', 'pug');

app.use(express.static('static'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/'
                                 })
);

app.post('/add',
  (req, res) => {
    if (req.user) {
      pool.getConnection((err, connection) => {
        connection.query('INSERT INTO website (user_id, name, url) VALUES (?, ?, ?)', 
                        [req.user.id, req.body.name, req.body.url],
                        (err, result) => {
                          console.log(result);
                          if (req.body.undo) {
                            res.status(201).json({id: result.insertId}).send();
                          } else {
                            res.status(201).redirect('/');
                          }
                        });
        });
    } else {
      res.sendStatus(401);
    }
  }
)

app.delete('/delete',
  (req, res) => {
    if (req.user) {
      pool.getConnection((err, connection) => {
        connection.query('DELETE FROM website WHERE user_id=? AND id=?', 
                        [req.user.id, req.body.id],
                        (err, result) => {res.sendStatus(200);});
        });
    } else {
      res.sendStatus(401);
    }
  }
)

const getWebsites = (user_id, callback) => {
  pool.getConnection((err, connection) => {
    connection.query("SELECT id, name, url, date FROM website WHERE user_id = ? ORDER BY date", 
                    [user_id],
                    callback);
    });
};

app.get('/',
    (req, res) => {
      if (req.user) {
        getWebsites(req.user.id, (err, result) => {
          res.render('bookmarks', {username: req.user.name, websites: result});
        });        
      } else {
        res.render('login');
      }
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);