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
    'build.config.js',
    'gulpfile.js',
    '.stylelintrc',
    '.eslintrc',
  ],
  html: [
    dir.src +'*.html',
  ],
  css: [
    dir.src +'*.css',
  ],
  js: [
    dir.src +'**/*.js',
    '!'+ dir.src +'**/*.spec-helper.js',
    '!'+ dir.src +'**/*.spec.js',
  ],
  spec: [
    dir.src +'**/*.spec-helper.js',
    dir.src +'**/*.spec.js',
  ],
};

module.exports = {
  dir: dir,
  files: files,
};

/*
  eslint-env node
*/

