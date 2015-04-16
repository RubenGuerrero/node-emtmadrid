'use strict';

var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console({
      colorize: true,
      silent: false
    })
  ]
});

module.exports = logger;
