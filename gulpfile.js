'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

gulp.task('default', (cb) => {
  console.log('Hello');
  cb();
});

gulp.task('sass', function () {
  return gulp.src('frontend/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('frontend/styles/**/*.scss', ['sass']);
});