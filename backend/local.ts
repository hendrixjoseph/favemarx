import https from 'https';
import fs from "fs";
import express from 'express';
import getApp from './app.js';
import UserDb from './modules/mysql/user.db.js';
import getMySqlPool from './modules/mysql/mysql.init.js';

const userDb = new UserDb(getMySqlPool())

const app = getApp();

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

app.get('/hello', (req ,res) => {
  res.send('hello');
});

// https.createServer({
//     key: fs.readFileSync("backend/key.pem"),
//     cert: fs.readFileSync("backend/cert.pem"),
//   },
//   app
// ).listen(443, () => {
//     console.log(`Running on https://localhost:443`);
// });

// // redirect http to https
// let http = express();

// http.get('*', (req, res) =>{
//   res.redirect('https://' + req.headers.host + req.url);
// });

// http.listen(80);

app.listen(80);