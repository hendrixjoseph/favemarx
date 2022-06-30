'use strict';

var app = require('./app.js');

require('greenlock-express')
    .init({
        packageRoot: __dirname,
        maintainerEmail: "contact@favemarx.com",
        configDir: './greenlock.d',
        cluster: false
    })
    .serve(app);
