let gulp = require('gulp');
let gettext = require('gulp-angular-gettext');

gulp.task('extract', function() {
    return gulp.src(['src/**/*.html', 'src/**/*.ts'])
        .pipe(gettext.extract('mpdx.pot', {
            ignore: 'src/**/*.test.ts'
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
