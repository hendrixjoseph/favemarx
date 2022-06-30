'use strict';

const PORT = 443;

const https = require('https');
const fs = require("fs");
const app = require('./app.js');
const express = require('express');

https.createServer({
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  },
  app
).listen(PORT, () => {
    console.log(`Running on https://localhost:${PORT}`);
});

// redirect http to https
let http = express();

http.get('*', (req, res) =>{
  res.redirect('https://' + req.headers.host + req.url);
});

http.listen(80);