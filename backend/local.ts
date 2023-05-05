import https from 'https';
import fs from "fs";
import express from 'express';
import getApp from './app.js';

https.createServer({
    key: fs.readFileSync("backend/key.pem"),
    cert: fs.readFileSync("backend/cert.pem"),
  },
  getApp()
).listen(443, () => {
    console.log(`Running on https://localhost:443`);
});

// redirect http to https
let http = express();

http.get('*', (req, res) =>{
  res.redirect('https://' + req.headers.host + req.url);
});

http.listen(80);