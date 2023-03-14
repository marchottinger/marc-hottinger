const { series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

function clean(cb) {
  // body omitted
  cb();
}

function css(cb) {
  gulp.src('./src/scss/**/*.less')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/css'));
  cb();
}

function javascript(cb) {
    // body omitted
    cb();
}

function serve(cb) {
    browserSync.init({
      server: {
          baseDir: "./src"
      }
    });

    gulp.watch('src/scss/*.less', css);
    gulp.watch("./src/*.html").on('change', browserSync.reload);
    gulp.watch("./src/scss/*.less").on('change', browserSync.reload);
    cb();
}

function commit(cb) {
    // body omitted
    cb();
}

exports.default = series(clean, parallel(css, javascript), serve);
exports.build = series(clean, parallel(css, javascript), serve);