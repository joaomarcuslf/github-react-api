const gulp = require('gulp');
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const exec = require('child_process').exec;
const cssBeautify = require('gulp-cssbeautify');
const cssComb = require('gulp-csscomb');
const foreach = require('gulp-foreach');

/* Tasks */

gulp.task('default', () => {
  gutil.log('Gulp is working fine');
});

// Bundle

gulp.task('bundle:js', () => {
  gutil.log('Starting bundle js files task');
  return exec('npm run bundle:js');
});

gulp.task('bundle:scss', () => {
  gutil.log('Starting bundle scss files task');
  return gulp.src('./assets/stylesheets/main.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(cssBeautify({
    indent: '  ',
    openbrace: 'separate-line',
    autosemicolon: true
  }))
  .pipe(autoprefixer())
  .pipe(cssComb())
  .pipe(concat('bundle.css'))
  .pipe(gulp.dest('./build/'));
});

// Watchers

gulp.task('watch:scss', () => {
  gutil.log('Starting gulp scss bundle watcher');
  gulp.watch('assets/scss/**/*.scss', ['bundle:scss']);
});

// Build

gulp.task('run:build', ['build:js', 'build:scss'], () => {
  gutil.log('Build assets complete');
});

gulp.task('build:js', () => {
  return exec('npm run build:js');
});

gulp.task('build:scss', () => {
  return gulp.src('./assets/stylesheets/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS({
      compatibility: 'ie8',
      debug: true
    }, function(details) {
      gutil.log(gutil.colors.red(`${details.name}: ${details.stats.originalSize}`));
      gutil.log(gutil.colors.green(`${details.name}: ${details.stats.minifiedSize}`));
    }))
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('build/'));
});

// Test

gulp.task('run:test', () => {
  gutil.log('Running your specs files');
  return gulp
  .src('./specs/**/*.spec.js')
  .pipe(foreach(function(stream, file){
    gutil.log('In:', file);
    return stream
      .pipe(babel())
      .pipe(mocha());
  }));
});
