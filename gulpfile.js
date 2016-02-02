var gulp       = require('gulp');
var source     = require('vinyl-source-stream');
var buffer     = require('vinyl-buffer');
var browserify = require('browserify');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del        = require('del');
var gutil      = require('gulp-util');
var plumber    = require('gulp-plumber');
var resolve    = require('resolve');

var packageJson = require('./package.json');
var dependencies = Object.keys(packageJson && packageJson.dependencies || {});

var production = (process.env.NODE_ENV === 'development');

gulp.task('default', ['clean', 'js:app', 'js:libs']);

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

// note - dist should be build artifact
gulp.task('clean', function() {
  return del('./app/dist/**/**');
});

gulp.task('js:libs', function() {
  return browserify()
    .require(dependencies)
    .bundle()
    // .on('error', handleErrors)
    //.pipe(uglify({ mangle: false }))
    .pipe(source('libs.js'))
    .pipe(gulp.dest('./app/dist/'));
});


// todo - split vendor and app dependencies into separate bundles
gulp.task('js:app', function() {
  // todo - if necc, support for bower dependencies
  return browserify('./app/index.js')
    .external(dependencies)
    .transform("babelify")
    .bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    //.pipe(uglify({ mangle: false }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./app/dist/'));
});
