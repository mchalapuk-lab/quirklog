'use strict';

var dir = {
  src: 'src/',
  build: 'dist/',
};

var files = {
  setup: [
    'setup.sh',
  ],
  config: [
    '.writ.config.js',
    '.writ.gulpfile.js',
    'gulpfile.js',
  ],
  html: [
    dir.src +'*.html',
  ],
  css: [
    dir.src +'*.scss',
  ],
  js: [
    dir.src +'*.js',
  ],
};

module.exports = {
  dir: dir,
  files: files,
};

/*
  eslint-env node
*/

