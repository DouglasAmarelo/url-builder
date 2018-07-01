var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var babel = require('gulp-babel');

gulp.task('connect', function() {
	connect.server({
		root: 'public',
		port: 3000,
		livereload: true
	});
});

gulp.task('html', function () {
	gulp.src('./src/*.html')
		.pipe(gulp.dest('./public'))
		.pipe(connect.reload());
});

gulp.task('script', function () {
	gulp.src('src/scripts/*.js')
		.pipe(babel())
		.pipe(gulp.dest('./public/js'));
});

gulp.task('sass', function() {
	return gulp.src('./src/sass/*.scss')
			.pipe(sass({ errLogToConsole: true }))
			.pipe(gulp.dest('./public/css'));
});

gulp.task('livereload', function() {
	gulp.src('./public/**/*')
	.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch('./src/sass/**/*.scss', ['sass']);
	gulp.watch('./src/scripts/**/*.js', ['script']);
	gulp.watch('./src/*.html', ['html']);
	gulp.watch('./public/**/*', ['livereload']);
});

gulp.task('default', ['connect', 'html', 'script', 'sass', 'watch']);



