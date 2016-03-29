var gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  browserify = require('browserify'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  del = require('del'),
  gutil = require('gulp-util'),
  plumber = require('gulp-plumber'),
  resolve = require('resolve'),
  watchify = require('watchify'),
  notify = require('gulp-notify');

var packageJson = require('./package.json');
var dependencies = Object.keys(packageJson && packageJson.dependencies || {});

var production = (process.env.NODE_ENV === 'development');

gulp.task('default', ['clean', 'js:app:dev', 'js:libs']);
gulp.task('default', ['clean', 'js:app:prod', 'js:libs']);

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

// https://www.timroes.de/2015/01/06/proper-error-handling-in-gulp-js/
var gulp_src = gulp.src;
gulp.src = function() {
  return gulp_src.apply(gulp, arguments)
    .pipe(plumber(function(error) {
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      this.emit('end');
    }));
};

// note - dist should be build artifact
gulp.task('clean', function() {
  del('./app/dist/**/**').then(function(paths) {
    console.log('Deleted files and folders:\n', paths.join('\n'));
    return;
  });
});

gulp.task('js:libs', function() {
  return browserify()
    .require(dependencies)
    .bundle()
    .on('error', handleErrors)
    //.pipe(uglify({ mangle: false }))
    .pipe(source('libs.js'))
    .pipe(gulp.dest('./app/dist/'));
});

gulp.taks('js:app:prod', function() {
  var props = {
    entries: './app/index.js',
    cache: {},
    packageCache: {},
    verbose: true
  };

  var bundler = browserify(props);
  bundler.transform("babelify")
    .external(dependencies);
  

})
gulp.task('js:app:dev', function() {
  var props = {
    entries: './app/index.js',
    cache: {},
    packageCache: {},
    verbose: true
  };

  var bundler =  watchify(browserify(props));
  bundler.transform("babelify")
    .external(dependencies);

  function rebundle() {
    var stream = bundler.bundle();
    return stream.on('error', handleErrors)
      .pipe(source('app.min.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({
        loadMaps: true
      }))
      //.pipe(uglify({ mangle: false }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./app/dist/'));
  }
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });
  return rebundle();
});
