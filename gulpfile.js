'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var stylelint = require('gulp-stylelint');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var jasmine = require('gulp-jasmine');
var eslint = require('gulp-eslint');
var connect = require('gulp-connect');
var fixme = require('fixme');
var del = require('del');
var child = require('child_process');
var yargs = require('yargs');
var _ = require('underscore');

var config = require('./build.config');

[ 'html', 'css', 'js' ].forEach(function(ext) {
  gulp.task('clean:'+ ext, function(callback) {
    return del([ config.dir.build +'*.'+ ext ], callback);
  });
});

[ 'config', 'js', 'spec' ].forEach(function(key) {
  gulp.task('lint:'+ key, function() {
    return gulp.src(config.files[key])
      .pipe(eslint())
      .pipe(eslint.format())
    ;
  });
});

gulp.task('lint:css', function() {
  return gulp.src(config.files.css)
    .pipe(stylelint({
      reporters: [ { formatter: 'string', console: true } ],
    }))
  ;
});

gulp.task('css', [ 'clean:css', 'lint:css' ], function() {
  return gulp.src(config.files.css)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(config.dir.build))
  ;
});

gulp.task('javascript', [ 'clean:js', 'lint:js' ], function() {
  return browserify(config.dir.src +'app.js').bundle()
   .pipe(source('app.js', config.dir.src).on('error', gutil.log))
   .pipe(gulp.dest(config.dir.build))
  ;
});

gulp.task('spec', [ 'lint:spec' ], function() {
  return gulp.src(config.files.spec)
    .pipe(jasmine({
      // verbose: true,
      includeStackTrace: true,
    }))
  ;
});

gulp.task('html', [ 'clean:html' ], function() {
  return gulp.src(config.files.html)
    .pipe(gulp.dest(config.dir.build))
  ;
});

gulp.task('dist', [ 'html', 'css', 'javascript' ]);
gulp.task('default', [ 'dist', 'spec' ]);

gulp.task('fixme', _.partial(fixme, {
  file_patterns: [ '**/*.js', '**/*.scss' ],
  ignored_directories: [ 'node_modules/**', '.git/**', 'dist/**' ],
}));

gulp.task('watch', [ 'dist' ], function() {
  gulp.watch(config.files.html, [ 'html' ]);
  gulp.watch(config.files.css, [ 'sass' ]);
  gulp.watch(config.files.js, [ 'javascript', 'spec' ]);
  gulp.watch(config.files.spec, [ 'spec' ]);

  connect.server({
    root: [ 'dist' ],
    port: 8889,
    livereload: false,
  });
});

gulp.task('autoreload', function() {
  var actualGulp = null;

  gulp.watch(config.files.config, function() {
    gulp.start('lint:config');
    actualGulp.kill('SIGUSR1');
    spawnAnotherChild();
  });

  function spawnAnotherChild() {
    actualGulp = child.spawn('gulp', [ yargs.argv.task ], { stdio: 'inherit' });
    actualGulp.on('close', function(code, signal) {
      if (signal !== 'SIGUSR1') {
        process.exit(code);
      }
    });
  }

  spawnAnotherChild();
});

/*
  eslint-env node
*/

/*
  eslint camelcase:0
*/

