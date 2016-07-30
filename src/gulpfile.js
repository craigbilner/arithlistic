const gulp = require('gulp');
const zip = require('gulp-zip');
const del = require('del');
const replace = require('gulp-replace-task');
const fs = require('fs');
const runSequence = require('run-sequence');
const awsLambda = require("node-aws-lambda");

gulp.task('clean', function() {
  return del(['./dist/**/*', '!./dist/node_modules', '!./dist/node_modules/**/*']);
});

gulp.task('env', function() {
  const ENV = JSON.parse(fs.readFileSync('./deploy.env.json', 'utf8'));

  gulp.src('./lambda-config.js')
    .pipe(replace({
      patterns: [
        {
          match: 'ROLE',
          replacement: ENV.ROLE,
        },
        {
          match: 'ACCESS_KEY_ID',
          replacement: ENV.ACCESS_KEY_ID,
        },
        {
          match: 'SECRET_ACCESS_KEY',
          replacement: ENV.SECRET_ACCESS_KEY,
        },
      ]
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('js', function() {
  return gulp.src([
    'index.js',
    'enums.js',
    'responses.js',
    'handlers/**/*',
    'modules/**/*',
  ], { base: './' })
    .pipe(gulp.dest('dist/'));
});

gulp.task('zip', function() {
  return gulp.src(['dist/**/*'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('upload', function(callback) {
  awsLambda.deploy('./dist/dist.zip', require("./dist/lambda-config.js"), callback);
});

gulp.task('deploy', function(callback) {
  return runSequence(
    ['clean'],
    ['env'],
    ['js'],
    ['zip'],
    ['upload'],
    callback
  );
});
