var gulp = require('gulp'),
    bower = require('main-bower-files'),
    bowerNormalize = require('gulp-bower-normalize'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('bower', function () {
    return gulp.src(bower(), {
    		base: './js/bower_components'
    	})
        .pipe(bowerNormalize ({
        	bowerJson : './bower.json',
        	flatten : true
        }))
        .pipe(gulp.dest('../public/'));
});

gulp.task('minify', function () {
    return gulp.src('./js/*.js')
        .pipe(uglify())
        .pipe(rename({
            extname : '.min.js'
        }))
        .pipe(gulp.dest('../public/js/'));
});

gulp.task('default', ['minify']);