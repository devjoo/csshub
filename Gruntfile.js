'use strict';
/**
 * Created by CODEMit, Inc. 2016
 * @name: The streaming build system Grunt
 * @support: dev@codemit.com
 * @version: 1.0.0
 * @license: https://codemit.com/licenses/mit-license
 */

module.exports = function(grunt) {

	var
		rootPath	= './',					// The root of the project
		srcPath		= rootPath + 'src/',	// The folder source
		buildPath	= rootPath + 'test/',	// The templates folder
		defaultOut	= 'assets/css';			// The default output

	var // Connect json files
		src = require(rootPath + 'csshub-src.json') || {};

	// The path module provides utilities for working with file and directory paths.
	var path = require('path');

	// Building a files
	var expandMapping = function(patterns) {
		var files = [];

		grunt.file.expandMapping(patterns).forEach(function(item) {
			var out = buildPath + (grunt.option('out') || defaultOut);

			files.push({
				src: item.dest,
				dest: out + '/' + path.parse(item.dest).name + '.css'
			});

		});

		return files;
	};

	var gruntOptions = {
		pkg: grunt.file.readJSON('package.json'),

		// Configuration Stylus compiled to CSS
		// @console: grunt styl [-out=css, -compress, -map]
		stylus: {
			compile: {
				options: {
					//relativeDest: buildPath + (grunt.option('out') || defaultOut),
					compress: grunt.option('compress') || false,
					sourcemap: {
						comment: false,
						inline: grunt.option('map') || false
					}
				},
				//files: [{'styl.css': src.styl}]
				files: expandMapping(src.styl) || []
			}
		},

		// Configuration Less compiled to CSS
		// @console: grunt less [-out=css, -compress, -map]
		less: {
			production: {
				options: {
					//rootpath: buildPath + (grunt.option('out') || defaultOut),
					compress: grunt.option('compress') || false,
					sourceMap: grunt.option('map') || false
				},
				files: expandMapping(src.less) || []
			}
		},

		// Configuration SCSS compiled to CSS
		// @console: grunt sass [-out=css, -compress, -map]
		sass: {
			dist: {
				options: {
					outputStyle: grunt.option('compress') ? 'compressed' : false,
					sourceMap: grunt.option('map') || false
				},
				files: expandMapping(src.sass) || []
			}
		},

		//
		// Watch, that actually is an endless stream
		// @console: grunt watch [styl, less, sass] [-out=css, -compress, -map]
		//
		watch: {
			styl: { files: src.styl, tasks: ['stylus'] },
			less: { files: src.less, tasks: ['less'] },
			sass: { files: src.sass, tasks: ['sass'] }
		}
	};

	// Project configuration.
	grunt.initConfig(gruntOptions);

	// Compile Stylus files to CSS
	grunt.loadNpmTasks('grunt-contrib-stylus');

	// Compile Less files to CSS
	grunt.loadNpmTasks('grunt-contrib-less');

	// Compile SASS files to CSS
	grunt.loadNpmTasks('grunt-sass');

	// Watch, that actually is an endless stream
	grunt.loadNpmTasks('grunt-contrib-watch');

	//grunt.registerTask('default', []);

	/**
	  * CSSHub Test
	  * @console: grunt test
	  */
	grunt.registerTask('test', ['stylus', 'less', 'sass']);
	grunt.registerTask('styl', ['stylus']);
};