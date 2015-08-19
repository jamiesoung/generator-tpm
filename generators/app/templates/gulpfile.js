
/*
 ** 前端代码的打包编译和压缩
*/
var path = require('path');
var fs = require('fs');

// 起本地服务器
var connect = require('gulp-connect');
var gulp = require('gulp');

// ES6 to ES5
var rimraf = require('gulp-rimraf');
var gutil = require('gulp-util');

// 支持
var browserify = require('browserify');
var globby = require('globby');

// 资源类型转换
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// 修改文件的名称
var rename = require('gulp-rename');
var streamify = require('gulp-streamify');

// js 压缩
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var less = require('gulp-less');

// 资源地址
var SRC_BASE = './src';
var BUILD_BASE = './build';
var DEV_BASE = './dev';

var SCRIPTS = SRC_BASE + '/p/*/index.js';

var LIB_BASE = [SRC_BASE + '/c/lib/*.js', SRC_BASE + '/c/lib/*.css'];

// clean
gulp.task('clean', function() {
	gulp.src(BUILD_BASE, {read: false})
		.pipe(rimraf({force: true}));
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
		    .pipe(streamify())
		    .pipe(gulp.dest(DEV_BASE + '/' + pageName))
		    .pipe(buffer())
		    .pipe(uglify())
		    .pipe(rename({
			  	suffix: '.min'
			 }))
		    .pipe(gulp.dest(BUILD_BASE + '/' + pageName))
		})
	});
});

// less编译 及 打包
gulp.task('less', function() {

	gulp.src(SRC_BASE + '/**/*.less')
		.pipe(less({
      			paths: [ path.join(__dirname, 'less', 'includes') ]
    		}).on('error', function(err){
    			gutil.log(err);
    		}))
		.pipe(minify())
		.on('error', function(err) {
			gutil.log('less error');
		})
		.pipe(gulp.dest(BUILD_BASE))
});

// copy 
gulp.task('lib', function() {

	gulp.src(LIB_BASE)
		.pipe(gulp.dest(BUILD_BASE + '/lib'));
});

// dev
gulp.task('dev:server', function() {
    connect.server({
        root: './',
        port: 8181,
        livereload: true
    });
});

gulp.task('dev', [
    'dev:server',
    'watch'
]);

// watch
gulp.task('watch', function() {

	gulp.watch(SRC_BASE + '/**/*', ['default']);
	
});

gulp.task('default', ['js', 'less']);

