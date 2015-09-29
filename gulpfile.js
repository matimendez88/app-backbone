var gulp = require('gulp'),
	minifyCSS = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	del = require('del'),
	rename = require('gulp-rename'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'), // Prevent pipe breaking caused by errors from gulp plugins
	handlebars = require('gulp-handlebars'),
	wrap = require('gulp-wrap'),
	declare = require('gulp-declare');

gulp.task('delete', function() {
	del(['assets/*'], function(err) {
		console.log("assets/ files deleted");
	});
});

gulp.task('templates', function(){
    gulp.src(['templates/*.hbs'])
        .pipe(handlebars())
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
          namespace: '__templates',
          noRedeclare: true, // Avoid duplicate declarations
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('templates/'));
});

// gulp.task('styles', function() {
// 	return gulp
// 		.src('css/styles.css')
// 		.pipe(minifyCSS())
// 		.pipe(rename({suffix: '.min'}))
// 		.pipe(gulp.dest('assets'));
// });

gulp.task('scripts', function() {
	return gulp
		.src([
			'bower_components/jquery/jquery.min.js',
			'bower_components/underscore/underscore-min.js',
			'bower_components/handlebars/handlebars.min.js',
			'bower_components/backbone/backbone.js',
			'templates/templates.js',
			'models/*.js',
			'collections/*.js',
			'views/*.js',
			'routes/*.js',
			'helpers/*.js',
			'application.js'
		])
		.pipe(plumber())
		.pipe(uglify())
		.pipe(jshint())
		.pipe(concat('bundle.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('assets'));
});

gulp.task('watch', function() {
	// gulp.watch('css/style.css', ['styles']);
	gulp.watch([
		'bower_components/*.js',
		'templates/templates.js',
		'models/*.js',
		'collections/*.js',
		'views/*.js',
		'routes/*.js',
		'helpers/*.js',
		'application.js'
	], ['scripts']);
	gulp.watch(['templates/*.hbs'], ['templates']);
});

gulp.task('default', ['delete', 'scripts', 'watch']);