var gulp       = require('gulp');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var browserify = require('browserify');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del        = require('del');
var gutil      = require('gulp-util');
var plumber    = require('gulp-plumber');


// https://www.timroes.de/2015/01/06/proper-error-handling-in-gulp-js/
var gulp_src   = gulp.src;
gulp.src       = function() {
  return gulp_src.apply(gulp, arguments)
    .pipe(plumber(function(error) {
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      this.emit('end');
    })
  );
};

gulp.task('clean', function() {
  return del('./app/dist/**/**')
  });

gulp.task('js', function() {
  return browserify('./app/index.js', { debug: true }).bundle()
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify({ mangle: false, compress: false }))
    .pipe(sourcemaps.write('/maps'))
    .pipe(gulp.dest('./app/dist/'));
});
