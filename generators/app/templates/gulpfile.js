
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

var SCRIPTS = SRC_BASE + '/**/*/index.js';
var LIB_SCRIPT = SRC_BASE + '/c/lib/*.js';
var LIB_STYLE = SRC_BASE + '/c/lib/*.css';
var STYLES = SRC_BASE + '/**/*/index.less';


function isLib(list) {

	var len = list.length;
	for(var i = 0; i < len; i++) {
		if(list[i] === 'lib') return true;
	}

	return false;
}
// clean
gulp.task('clean', function() {
	// gulp.src(BUILD_BASE, {read: false})
	// 	.pipe(rimraf({force: true}));
});

// js 打包 browserify 版
gulp.task('js', function() {

	var isError = false;

	globby([SCRIPTS, LIB_SCRIPT], function(err, filePaths) {

		if(err) {
			gutil.log('globby error');
			return ;
		}
		console.log('js 打包中...');
		// 打包压缩文件到 build
		// browserify 一次只能接受一个文件
		filePaths.forEach(function(filePath) {
		
			var pageNameReg = new RegExp(SRC_BASE + '\/*\/(.*)\/');
	        var pageName = filePath.match(pageNameReg)[1].split('/')[1];

	        var fileList = filePath.split('/');
	        var fileName = fileList[fileList.length - 1];

	        if(isLib(fileList)) {
	        	browserify(filePath)
			    .bundle()
			    .on('error', function(err) {

					if(!isError) {
						gutil.log(err);
						isError = true;
					}
				})
			    .pipe(source(fileName))
			    .pipe(gulp.dest(BUILD_BASE + '/' + pageName))

	        } else {
	        	
	        	browserify(filePath)
			    .bundle()
			    .on('error', function(err) {

					if(!isError) {
						gutil.log(err);
						isError = true;
					}
				})
			    .pipe(source(fileName))
			    .pipe(gulp.dest(DEV_BASE + '/' + pageName))
			    .pipe(buffer())
			    .pipe(uglify())
			    .pipe(gulp.dest(BUILD_BASE + '/' + pageName))
	        }
	  		
		});
	});
});

// less编译 及 打包
gulp.task('less', function() {

	globby([STYLES, LIB_STYLE], function(err, filePaths) {

		if(err) {
			gutil.log('globby error');
			return ;
		}
		console.log('less编译中...');

		filePaths.forEach(function(filePath) {
			var pageNameReg = new RegExp(SRC_BASE + '\/*\/(.*)\/');
	        var pageName = filePath.match(pageNameReg)[1].split('/')[1];

	        gulp.src(filePath)
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

// watch
gulp.task('watch', ['less'], function() {

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
gulp.task('build', ['less', 'js'], browserSync.reload);

gulp.task('default', ['build']);

