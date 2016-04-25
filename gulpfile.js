const gulp          = require('gulp'),
      fs            = require('fs'),
      pkg           = require('./package.json'),
      path          = require('path'),
      less          = require('gulp-less'),
      watch         = require('gulp-watch'),
      gulpif        = require('gulp-if'),
      gutil         = require('gulp-util'),
      debug         = require('gulp-debug'),
      uglify        = require('gulp-uglify'),
      csso          = require('gulp-csso'),
      autoprefixer  = require('gulp-autoprefixer'),
      plumber       = require('gulp-plumber'),
      concat        = require('gulp-concat'),
      imagemin      = require('gulp-imagemin'),
      sourcemaps    = require('gulp-sourcemaps'),
      GulpSSH       = require('gulp-ssh'),
      runSequence   = require('run-sequence'),
      cssbeautify   = require('gulp-cssbeautify'),
      rename        = require("gulp-rename");


var isDebug = true;
var dist = false;

gulp.task('default',['styles', 'plugins', 'scripts'], function() {
});

gulp.task('dist', function() {
  dist = true;
});

gulp.task('build', function() {
  runSequence('dist', ['default']);
});

gulp.task('images', () => {
    return gulp.src('src/images/*.{jpg,gif,png,svg}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('styles', function () {
  return gulp.src('src/styles/main.less')
    .pipe(plumber(function (error) {
      plumberError(error);
      this.emit('end');
    }))

    .pipe(gulpif(!dist, sourcemaps.init() ))
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 6 versions'],
      cascade: false
    }))
    .pipe(gulpif(!dist, sourcemaps.write({includeContent: false, sourceRoot: '/source'} )))

    .pipe(gulpif(isDebug, debug({verbose: true})))
    .pipe(gulpif(dist, csso()))
    .pipe(cssbeautify())
    .pipe(gulp.dest('./public/css'))

});

gulp.task('scripts', function () {
  return gulp.src(['./src/scripts/inc/*.js','./src/scripts/components/*.js', './src/scripts/main.js' ])
    .pipe(plumber(function (error) {
      plumberError(error);
      this.emit('end');
    }))
    .pipe(concat('main.js'))
    .pipe(gulpif(dist, uglify() ))
    .pipe(gulpif(isDebug, debug({verbose: true})))
    .pipe(gulp.dest('./public/js'))
});

gulp.task('plugins', function () {
  return gulp.src('./src/plugins/*.js')
    .pipe(plumber(function (error) {
      plumberError(error);
      this.emit('end');
    }))
    .pipe(concat('plugins.js'))
    .pipe(gulpif(isDebug, debug({verbose: true})))
    .pipe(gulp.dest('./public/js'))
});

gulp.task('watch', ['default', 'images'],function() {
    watch('./src/**/*.less', function() {
        gulp.start('styles');
    });
    watch(['./src/scripts/*.js', './src/scripts/**/*.js'], function() {
        gulp.start('scripts');
    });
    watch('./src/plugins/*.js', function() {
        gulp.start('plugins');
    });
    watch('./src/images/*.*', function() {
        gulp.start('images');
    });
});


var plumberError = function (err) {
  //gutil.beep();
  console.log(err);
};

