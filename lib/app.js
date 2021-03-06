'use strict';

const _ = require('lodash');
const express = require('express');
const log = require('winston');

// Load Express
const app = express();

app.use('/', require('./routes/hooks')());

app.listen(process.env.PORT || 3000).on('error', function(err){
    log.error('Express error', err);
});

// Catch All
process.on('uncaughtException', function (err) {
  log.error('Uncaught error', err);
});
