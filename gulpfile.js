const gulp = require('gulp');
const babel = require('gulp-babel');
const livereload = require('gulp-livereload');
const nodemon = require('gulp-nodemon');

gulp.task('html', () => {
  return gulp.src('./src/public/**/*.html')
    .pipe(livereload());
});

gulp.task('js', () => {
  return gulp.src('./src/public/**/*.js')
    .pipe(livereload());
});

gulp.task('watch', () => {
  livereload.listen();
  gulp.watch('./src/public/**/*.html', ['html']);
  gulp.watch('./src/public/**/*.js', ['js']);
});

gulp.task('set-dev-node-env', () => (process.env.NODE_ENV = 'testing'));

gulp.task('set-prod-node-env', () => (process.env.NODE_ENV = 'production'));

gulp.task('server', ['set-dev-node-env'], () => {
    return nodemon({
      script: './src/server/app.js',
      ignore: './src/public/',
    });
});

gulp.task('serve', ['server', 'watch']);