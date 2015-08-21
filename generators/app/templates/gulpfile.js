
/*
 ** 前端代码的打包编译和压缩
*/

var path = require('path');
var fs = require('fs');

// 起本地服务器
// var connect = require('gulp-connect');
var gulp = require('gulp');

var rimraf = require('gulp-rimraf');
var gutil = require('gulp-util');
var browserify = require('browserify');
var globby = require('globby');

// 资源类型转换
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// js 压缩
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var less = require('gulp-less');

// browserSync
var browserSync = require('browser-sync').create();

// 资源地址
var SRC_BASE = './src';
var BUILD_BASE = './build';
var DEV_BASE = './dev';
var DEMO_BASE = './demo';

var SCRIPTS = SRC_BASE + '/p/*/index.js';
var LIB_BASE = [SRC_BASE + '/c/lib/*.js', SRC_BASE + '/c/lib/*.css'];
var STYLES = SRC_BASE + '/p/*/index.less';

// clean
gulp.task('clean', function() {
	// gulp.src(BUILD_BASE, {read: false})
	// 	.pipe(rimraf({force: true}));
});

// js 打包 browserify 版
gulp.task('js', function() {

	var isError = false;

	globby([SCRIPTS], function(err, filePaths) {


		if(err) {
			gutil.log('globby error');
			return ;
		}

		// 打包压缩文件到 build
		// browserify 一次只能接受一个文件
		filePaths.forEach(function(filePath) {
		
			var pageNameReg = new RegExp(SRC_BASE + '\/p\/(.*)\/');
	        var pageName = filePath.match(pageNameReg)[1];

	  		browserify(filePath)
		    .bundle()
		    .on('error', function(err) {

				if(!isError) {
					gutil.log(err);
					isError = true;
				}
			})
		    .pipe(source('index.js'))
		    .pipe(gulp.dest(DEV_BASE + '/' + pageName))
		    .pipe(buffer())
		    .pipe(uglify())
		    .pipe(gulp.dest(BUILD_BASE + '/' + pageName))
		});
	});
});

// less编译 及 打包
gulp.task('less', function() {

	globby([STYLES], function(err, filePaths) {

		if(err) {
			gutil.log('globby error');
			return ;
		}

		filePaths.forEach(function(filePath) {
			var pageNameReg = new RegExp(SRC_BASE + '\/p\/(.*)\/');
	        var pageName = filePath.match(pageNameReg)[1];

	        gulp.src(SRC_BASE + '/p/'+ pageName +'/index.less')
		        .pipe(less().on('error', function(err){
		        	gutil.log('Less error, the director name is:' + pageName);
	    			gutil.log(err);
	    		}))
				.pipe(minify())
				.on('error', function(err) {
					gutil.log('Less error, the director name is:' + pageName);
				})
				.pipe(gulp.dest(BUILD_BASE + '/' + pageName))
				.pipe(browserSync.stream({match: '**/*.css'}))
		});
	});
});

// copy 
gulp.task('lib', function() {

	gulp.src(LIB_BASE)
		.pipe(gulp.dest(BUILD_BASE + '/lib'));
});

// watch
gulp.task('watch', ['less', 'lib'], function() {

	browserSync.init({
		server: {
			baseDir: './',
			index: '/index.html'
		},
		startPath: './demo'
	});

	gulp.watch(DEMO_BASE + "/**/*.html").on('change', browserSync.reload);
	gulp.watch(SRC_BASE + '/**/*.js', ['build-js']);
	gulp.watch(SRC_BASE + '/**/*.less', ['less'])
	
});


gulp.task('build-js', ['js'], browserSync.reload);
gulp.task('build', ['js', 'less', 'lib'], browserSync.reload);

gulp.task('default', ['build']);

