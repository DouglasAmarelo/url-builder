var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var babel = require('gulp-babel');

gulp.task('connect', function() {
	connect.server({
		root: 'dist',
		port: 3000,
		livereload: true
	});
});

gulp.task('html', function () {
	gulp.src('./src/*.html')
		.pipe(gulp.dest('./dist'))
		.pipe(connect.reload());
});

gulp.task('script', function () {
	gulp.src('src/scripts/*.js')
		.pipe(babel())
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('sass', function() {
	return gulp.src('./src/sass/*.scss')
			.pipe(sass({ errLogToConsole: true }))
			.pipe(gulp.dest('./dist/css'));
});

gulp.task('livereload', function() {
	gulp.src('./dist/**/*')
	.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch('./src/sass/**/*.scss', ['sass']);
	gulp.watch('./src/scripts/**/*.js', ['script']);
	gulp.watch('./src/*.html', ['html']);
	gulp.watch('./dist/**/*', ['livereload']);
});

gulp.task('default', ['connect', 'watch', 'html', 'script', 'sass']);



