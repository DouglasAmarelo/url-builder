var gulp    = require('gulp');
var sass    = require('gulp-sass');
var connect = require('gulp-connect');
var babel   = require('gulp-babel');
var browserSync   = require('browser-sync').create();

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'dist'
		},
		notify: false
	})
});

gulp.task('html', function () {
	gulp.src('./src/*.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('script', function () {
	gulp.src('src/scripts/*.js')
		.pipe(babel())
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('sass', function() {
	return gulp.src('./src/sass/**/*.scss')
			.pipe(sass({
				outputStyle: 'compressed'
			})
			.on('error', sass.logError))
			.pipe(gulp.dest('./dist/css'))
			.pipe(browserSync.reload({
				stream: true
			}));
});


gulp.task('watch', ['script', 'sass', 'html'], function() {
	gulp.watch('./src/sass/**/*.scss', ['sass']);
	gulp.watch('./src/scripts/**/*.js', ['script']).on('change', browserSync.reload);
	gulp.watch('./src/*.html', ['html']).on('change', browserSync.reload);
});

gulp.task('default', ['browserSync', 'watch']);



