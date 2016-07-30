const gulp = require('gulp');
const zip = require('gulp-zip');
const del = require('del');
const install = require('gulp-install');
const runSequence = require('run-sequence');
const awsLambda = require("node-aws-lambda");

gulp.task('clean', function () {
  return del(['./dist/**/*', '!./dist/node_modules', '!./dist/node_modules/**/*']);
});

gulp.task('js', function () {
  return gulp.src([
    'index.js',
    'enums.js',
    'handlers/**/*',
    'modules/**/*',
  ], { base: './' })
    .pipe(gulp.dest('dist/'));
});

gulp.task('zip', function () {
  return gulp.src(['dist/**/*'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('upload', function (callback) {
  awsLambda.deploy('./dist.zip', require("./lambda-config.js"), callback);
});

gulp.task('deploy', function (callback) {
  return runSequence(
    ['clean'],
    ['js'],
    ['zip'],
    callback
  );
});
