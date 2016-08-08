'use strict';
/**
 * Created by CODEMit, Inc. 2016
 * @name: The streaming build system Gulp
 * @support: dev@codemit.com
 * @version: 1.0.0
 * @license: https://codemit.com/licenses/mit-license
 */

var
	// Automate and enhance your workflow
	gulp = require('gulp-param')(require('gulp'), process.argv),

	// Preprocessors
	stylus = require('gulp-stylus'),
	less = require('gulp-less'),
	sass = require('gulp-sass'),

	// Source Maps
	sourcemaps = require('gulp-sourcemaps'),

	// Delete files/folders using globs
	del = require('del');

var
	rootPath	= './',					// The root of the project
	srcPath		= rootPath + 'src/',	// The folder source
	buildPath	= rootPath + 'test/',	// The templates folder
	defaultOut	= 'assets/css';			// The default output

var // Connect json files
	src = require(rootPath + 'csshub-src.json') || {};

// Global compiled
var compiled = function(preprocessor, src, options) {
	return gulp.src(src)
	.pipe(sourcemaps.init())
	.pipe(preprocessor)
	.on('error', console.log)
	.pipe(sourcemaps.write((options[2] ? '.' : null), {
		addComment: options[2] || false
	}))
	.pipe(gulp.dest(buildPath + (options[0] || defaultOut)));
};

/**
 * Stylus compiled to CSS
 * @console: gulp styl [--out css, --compress true, --map true]
 */
gulp.task('styl', function(out, compress, map) {
	return compiled(stylus({
		compress: compress || false
	}), src.styl, arguments);
});

/**
 * Less compiled to CSS
 * @console: gulp less [--out css, --compress true, --map true]
 */
gulp.task('less', function(out, compress, map) {
	return compiled(less({
		compress: compress || false
	}), src.less, arguments);
});

/**
 * SCSS compiled to CSS
 * @console: gulp scss [--out css, --compress true, --map true]
 */
gulp.task('sass', function(out, compress, map) {
	return compiled(sass({
		outputStyle: compress ? 'compressed' : false
	}), src.sass, arguments);
});

/**
 * CSSHub Test
 * @console: gulp csshub-test
 */
gulp.task('test', ['styl', 'less', 'sass']);

/**
 * Watch, that actually is an endless stream
 * @console: gulp watch [--styl, --less, --sass] [--out css, --compress, --map]
 */
gulp.task('watch', function(styl, less, sass) {
	if(styl) gulp.watch(src.styl, ['styl']);
	if(less) gulp.watch(src.less, ['less']);
	if(sass) gulp.watch(src.sass, ['sass']);
});