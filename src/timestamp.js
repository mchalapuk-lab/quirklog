'use strict';

var hrtime = require('browser-process-hrtime');

var start = hrtime();

module.exports = function() {
  return hrtime(start);
};

/*
  eslint-env node
 */

