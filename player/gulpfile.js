
	var fs = require('fs');
	var path = require('path');
	var exec = require('child_process').exec;
	var gulp = require('gulp');
	var clean = require('gulp-clean');
	var rename = require('gulp-rename');
	var less = require('gulp-less');
	var livereload = require('gulp-livereload');

	/* ------------------------------------------------------------------------------------------ */

	gulp.task('clean-build', function () {

		return gulp.src([ 'build', 'dist' ], { read: false })
				   .pipe(clean());
	});

	gulp.task('less', function() {

		return gulp.src('./less/main.less')
				   	.pipe(less({
						paths: [
							path.join(__dirname, 'less'),
							path.join(__dirname, '..')
						],
						compress: true
				   	}))
					.pipe(gulp.dest('./dist/css'));

	});

	gulp.task('build', [ 'less', 'clean-build' ],  function () {

		exec('r.js.cmd -o build.js', function (Error, stdout, stderr) {

			if(Error) {

				return console.log(Error);
			}

			gulp.src([
					'build/app/main.js'
				])
			    .pipe(gulp.dest('dist'));

			gulp.src([
					'build/translate/es.js',
					'build/translate/ca.js'
				])
			    .pipe(gulp.dest('dist/translate'));

			gulp.src([
					'build/translate/locale/*'
				])
			    .pipe(gulp.dest('dist/translate/locale'));

			gulp.src([
					'build/dist.html'
				])
				.pipe(rename('index.html'))
			    .pipe(gulp.dest('dist'));
		});
	});

	/* ------------------------------------------------------------------------------------------ */

	gulp.task('reload', function() {

		livereload.reload();
	});

	gulp.task('watch', function () {

		livereload.listen();

	    gulp.watch([
	    	'./**/*',
	    ],
	    ['reload']);
	});

	/* ------------------------------------------------------------------------------------------ */

	gulp.task('default', ['watch']);