'use strict';

const salt = 'favemarx';

const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit : 100,
  host: 'favemarx_db',
  user: 'favemarx_web',
  password: 'password',
  database: 'favemarx'
});

// Configure passport
passport.use(new LocalStrategy(
  (username, password, done) => {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }

      connection.query('SELECT id, password_hash, verified FROM user WHERE email = ?', [username], (err2, result) => {
        if (err2) {
          throw err2
        }

        if(result.length === 1 && result[0].verified) {
          bcrypt.compare(username + password + salt, result[0].password_hash, (err, found) => {
            if(found) {
              connection.query('UPDATE user SET last_login_date = CURRENT_TIMESTAMP WHERE id = ?', [result[0].id]);
              return done(null, {name: username, id: result[0].id});
            } else {
              // bad password
              return done(null, false);
            }
          });
        } else {
          // no user found or user not verified
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
const session = require('express-session');
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
                                   failureRedirect: '/login-failed'
                                 })
);

app.get('/logout',
  (req, res) => {
    req.logout();
    res.redirect('/');
});

app.post('/register', (req, res) => {
  if (req.body.user !== null
    && req.body.password !== null
    && req.body.password === req.body.verifyPassword) {
    bcrypt.hash(req.body.username + req.body.password + salt, 10, function(err, hash) {
      pool.getConnection((err, connection) => {
        connection.query(
          'INSERT INTO user (email, password_hash) VALUES (?, ?)', 
          [req.body.username, hash],
          (err, result) => {
            res.status(201).redirect('/');
          }
        );
      });
    });
  } else {
    res.statusCode(401).redirect('/');
  }
});

app.get('/verify/:email/:hash', (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      'SELECT * FROM user WHERE email = ?',
      [req.params.email],
      (err, result) => {
        if (result.length === 1) {
          let json = JSON.stringify(result[0]);
          bcrypt.compare(json, req.params.hash, (err, found) => {
            if (found) {
              connection.query(
                'UPDATE user SET verified = true WHERE email = ?', 
                [req.params.email],
                (err, result) => {
                  res.redirect('/');
                }
              );
            } else {
              res.send('Bad verification link.');
            }
          });
        } else {
          res.send('Bad verification link.');
        }
      }
    );
  });
});

app.post('/add', (req, res) => {
  if (req.user) {
    pool.getConnection((err, connection) => {
      connection.query(
        'INSERT INTO website (user_id, name, url) VALUES (?, ?, ?)', 
        [req.user.id, req.body.name, req.body.url],
        (err, result) => {
          if (req.body.undo) {
            res.status(201).json({id: result.insertId}).send();
          } else {
            res.status(201).redirect('/');
          }
        }
      );
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/update', (req, res) => {
  if (req.user) {
    pool.getConnection((err, connection) => {
      connection.query(
        'UPDATE website SET name = ?, url = ? WHERE id = ? AND user_id = ?', 
        [req.body.name, req.body.url, req.body.id, req.user.id],
        (err, result) => { res.sendStatus(200) });
    });
  } else {
    res.sendStatus(401);
  }
});

app.delete('/delete', (req, res) => {
  if (req.user) {
    pool.getConnection((err, connection) => {
      connection.query(
        'DELETE FROM website WHERE user_id=? AND id=?', 
        [req.user.id, req.body.id],
        (err, result) => {res.sendStatus(200);});
    });
  } else {
    res.sendStatus(401);
  }
});

app.get('/', (req, res) => {
  if (req.user) {
    pool.getConnection((err, connection) => {
      connection.query(
        'SELECT id, name, url, date FROM website WHERE user_id = ? ORDER BY date', 
        [req.user.id],
        (err, result) => {
          res.render('bookmarks', {username: req.user.name, websites: result});
        }
      );
    });
  } else {
    res.render('login');
  }
});

app.get('/login-failed', (req, res) => {
  res.render('login', {loginFailed: true});
});

app.get('/register', (req, res) => {
  res.render('register'); 
});

let sendVerificationEmail = (email, hash) => {
  let encodedEmail = encodeURIComponent(email);
  let encodedHash = encodeURIComponent(hash);
  let link = 'http://localhost:3000/verify/'+encodedEmail+'/'+encodedHash;
  let tag = '<a href="'+link+'">'+link+'</a>';
   
  let AWS = require('aws-sdk');

  AWS.config.loadFromPath('./aws-creds.json');

  let params = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: '<html><body>'+tag+'</body></html>'
        },
        Text: {
          Charset: "UTF-8",
          Data: link
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: 'Verify your account'
      }
    },
    Source: 'verfiy@favemarx.com'
  };

  let sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

  sendPromise.then(
    (data) => {
      console.log(data.MessageId);
    }).catch(
    (err) => {
      console.error(err, err.stack);
    });
}

app.get('/verificationLink/:email', (req, res) => {
  pool.getConnection((err, connection) => {
    connection.query(
      'SELECT * FROM user WHERE email = ?',
      [req.params.email],
      (err, result) => {
        let json = JSON.stringify(result[0]);
        bcrypt.hash(json, 10, function(err, hash) {
          let encodedEmail = encodeURIComponent(req.params.email);
          let encodedHash = encodeURIComponent(hash);
          let link = '/verify/'+encodedEmail+'/'+encodedHash;
          let tag = '<a href="'+link+'">'+link+'</a>';
          sendVerificationEmail(req.params.email, hash);
          res.send(tag);
        });
      }
    )
  });
});

module.exports = app;
