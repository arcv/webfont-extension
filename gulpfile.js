var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
  gulp.src(["./source/*.scss"])
    .pipe(sass({
      sourceComments: 'map',
      style: 'compact',
    }))
    .pipe(gulp.dest('./compile/'));
});

gulp.task('watch', function() {
	gulp.watch("./source/*.scss", ['sass']);
});

gulp.task('default', ["sass", "watch"]);