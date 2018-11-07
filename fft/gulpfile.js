const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const path = require('path');

gulp.task('build', transpileTypescript);
gulp.task('watch', gulp.series('build', watch));

function transpileTypescript() {
  return gulp.src([path.join('src', '**', '*.ts')])
    .pipe($.babel())
    .pipe(gulp.dest('dist/'));
}

// Watch for file changes
function watch() {
  gulp.watch([path.join('src', '**', '*.ts')], transpileTypescript);
}
