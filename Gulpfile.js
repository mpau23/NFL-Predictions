var gulp = require('gulp'),
    bower = require('main-bower-files'),
    bowerNormalize = require('gulp-bower-normalize'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    path = require('path'),
    minifyCss = require('gulp-minify-css'),
    svgmin = require('gulp-svgmin'),
    gutil = require('gulp-util');


gulp.task('bower', function() {
    return gulp.src(bower(), {
            base: './bower_components/'
        })
        .pipe(bowerNormalize({
            bowerJson: './bower.json',
            flatten: true
        }))
        .pipe(gulp.dest('./app/public/'));
});

gulp.task('appJs', function() {
    return gulp.src([
            './app/src/controllers/*.js',
            './app/src/classes/*.js',
            './app/src/*.js',
            './app/assets/js/*.js'
        ])
        .pipe(concat('app.js'))
        .pipe(uglify().on('error', gutil.log))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('./app/public/js/'));
});

gulp.task('appCss', function() {
    gulp.src('./app/assets/sass/*.scss')
        .pipe(compass({
            css: './app/public/css',
            sass: './app/assets/sass',
            image: './app/assets/images',
            javascript: './app/assets/js',
            font: './app/public/fonts',
            require: ['susy', 'breakpoint', 'compass/import-once/activate', 'normalize-scss']
        }))
        .pipe(minifyCss())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('./app/public/css/'));
});

gulp.task('appImage', function() {
    return gulp.src('./app/assets/images/*.svg')
        .pipe(svgmin())
        .pipe(rename({
            extname: '.min.svg'
        }))
        .pipe(gulp.dest('./app/public/images/'));
});

gulp.task('watch', ['default'], function() {
    gulp.watch([
        './app/src/controllers/*.js',
        './app/src/classes/*.js',
        './app/src/*.js',
        './app/assets/js/*.js'
    ], ['appJs']);
    gulp.watch(['./app/assets/sass/*.scss', './app/assets/sass/partials/*.scss'], ['appCss']);
    gulp.watch('./app/assets/images/*.svg', ['appImage']);
});


gulp.task('default', ['appJs', 'appCss', 'appImage']);
