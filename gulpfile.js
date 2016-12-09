var gulp = require('gulp');
var gettext = require('gulp-angular-gettext');

gulp.task('extract', function() {
    return gulp.src(['src/**/*.html', 'src/**/*.js'])
        .pipe(gettext.extract('mpdx.pot', {
            // options to pass to angular-gettext-tools...
        }))
        .pipe(gulp.dest('src/locale'));
});

gulp.task('translations', function() {
    return gulp.src('locale/**/*.po')
        .pipe(gettext.compile({
            // options to pass to angular-gettext-tools...
            format: 'json'
        }))
        .pipe(gulp.dest('public/locale/'));
});
