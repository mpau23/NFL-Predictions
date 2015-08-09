var gulp = require('gulp'),
    bower = require('main-bower-files'),
    bowerNormalize = require('gulp-bower-normalize'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename')
    concat = require('gulp-concat')
;

gulp.task('bower', function () {
    return gulp.src(bower(), {
    		base: './bower_components'
    	})
        .pipe(bowerNormalize ({
        	bowerJson : './bower.json',
        	flatten : true
        }))
        .pipe(gulp.dest('./app/public/'));
});

gulp.task('appJs', function () {
    return gulp.src('./app/components/**/*.js')
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename({
            extname : '.min.js'
        }))
        .pipe(gulp.dest('./app/public/js/'));
});

gulp.task('default', ['appJs']);