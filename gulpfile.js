var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var concat = require('gulp-concat');
var del = require('del');
var less = require('gulp-less');
var path = require('path');

gulp.task('clean', function () {
  return del(
    './dist/**'
  );
});

gulp.task('browserify', function() {
    var bundler = browserify({
        entries: ['./app/index.js'],
        debug: true,
        cache: {}, packageCache: {}, fullPaths: true
    });

    var watcher  = watchify(bundler);

    return watcher
    .on('update', function () {
        var updateStart = Date.now();
        console.log('Updating!');
        watcher.bundle()
        .pipe(source('index.js'))
    // This is where you add uglifying etc.
        .pipe(gulp.dest('./dist/'));
        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    })
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('index.js'))
    .pipe(gulp.dest('./dist/'));
});


gulp.task('less', function () {
  return gulp.src('./app/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('default', ['clean', 'browserify', 'less']);
