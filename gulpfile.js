'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('default', (cb) => {
  console.log('Hello');
  cb();
});

gulp.task('sass', function () {
  return gulp.src('frontend/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('frontend/styles/**/*.scss', ['sass']);
});

gulp.task('img', function () {
  return gulp.src('frontend/img/**/*.*')
    .pipe(gulp.dest('public/img'));
});


gulp.task('clean', function() {
  return del('public');
});


gulp.task('build', gulp.series('clean', gulp.parallel('sass', 'img')));