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
  watchify = require('watchify');

var dependencies = ['d3', 'react', 'react-dom'];

gulp.task('default', ['clean', 'js:app', 'js:libs', 'favicon']);
gulp.task('prod', ['clean', 'js:app:prod', 'js:libs', 'favicon']);

function handleErrors(error) {
  gutil.log(gutil.colors.red('Compile Error \n' + error ));
  this.emit('end');
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
  del('./app/dist/**/**');
});

gulp.task('favicon', function() {
  return gulp.src('./app/img/favicon/*')
    .pipe(gulp.dest('./app/dist/'));
});

gulp.task('js:libs', function() {
  return browserify()
    .transform("babelify")
    .require(dependencies)
    .bundle()
    .on('error', handleErrors)
    .pipe(source('libs.js'))
    .pipe(buffer())
    .pipe(uglify({ mangle: true, compress: true  }))
    .pipe(gulp.dest('./app/dist/'));
});

gulp.task('js:app:prod', function() {
  return browserify('./app/index.js')
    .transform("babelify")
    .external(dependencies)
    .bundle()
    .on('error', handleErrors)
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(uglify({ mangle: true, compress: true  }))
    .pipe(gulp.dest('./app/dist/'));

});

gulp.task('js:app', function() {
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
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./app/dist/'));
  }
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });
  return rebundle();
});
