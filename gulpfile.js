(function() {
    'use strict';
    //导入工具包 require('node_modules里对应模块')
    var gulp = require('gulp');

    /*======= 文件删除 ======*/
    var del = require('del');

    /*======= 任务排序 ======*/
    var runSequence = require('run-sequence');

    /*======= 语法检测 ======*/
    var jshint = require('gulp-jshint');
    var stylish = require('jshint-stylish');

    /*======= 压缩重命名 ======*/
    var rename = require('gulp-rename');
    var uglify = require('gulp-uglify');

    /*======= 合并文件 ======*/
    var concat = require('gulp-concat');

    /*======= 文件MD5时间戳 ======*/
    var rev = require('gulp-rev');
    var revCollector = require('gulp-rev-collector');

    /*======= 增加文件头尾 ======*/
    var header = require('gulp-header');
    var pkg = require('./package.json');

    /*======= 自定义上下文 ======*/
    var preprocess = require('gulp-preprocess');

    function getDate() {
        return new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
    }
    var banner = [
        '/**',
        ' * <%= pkg.description %>',
        ' * ',
        ' * version:<%= pkg.version %>',
        ' * ',
        ' * author:<%= pkg.author %>',
        ' * ',
        ' * email:<%= pkg.email %>',
        ' * ',
        ' * Copyright ' + new Date().getFullYear() + '',
        ' * ',
        ' * Licensed under <%= pkg.license %>',
        ' * ',
        ' * 最近修改于： <%= date %>',
        ' */',
        ''
    ].join('\n')

    /*======= css ======*/
    gulp.task('css', function() {
        return gulp.src(['./src/css/**/*'])
            .pipe(gulp.dest('./dev/css'))
            .pipe(gulp.dest('./public/css'))
    });
    /*======= lib ======*/
    gulp.task('lib', function() {
        return gulp.src(['./src/lib/**/*'])
            .pipe(gulp.dest('./dev/lib'))
            .pipe(gulp.dest('./public/lib'))
    });

    /*======= img ======*/
    gulp.task('img', function() {
        return gulp.src(['./src/img/**/*'])
            .pipe(gulp.dest('./dev/img'))
            .pipe(gulp.dest('./public/img'))
    });

    /*======= 合并压缩js文件 ======*/
    gulp.task('js', function() {
        return gulp.src('./src/js/LCalendar.js')
            .pipe(jshint())
            .pipe(jshint.reporter(stylish))
            .pipe(gulp.dest('./dev/js'))
            .pipe(rev())
            .pipe(uglify())
            .pipe(header(banner, {
                pkg: pkg,
                date: getDate()
            }))
            /*.pipe(rename({
                extname: '.min.js'
            }))*/
            .pipe(gulp.dest('./public/js'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('./src/rev'));
    });

    gulp.task('revHtml', function() {
        return gulp.src(['./src/rev/*.json', './src/html/*']) //- 读取 rev-manifest.json 文件以及需要进行路径替换的文件
            .pipe(revCollector({
                replaceReved: true
            })) //- 执行文件内路径的替换
            .pipe(gulp.dest('./dev/html/')) //- 替换后的文件输出的目录
            .pipe(gulp.dest('./public/html/')); //- 替换后的文件输出的目录
    });


    gulp.task('clean', function() {
        return del(['./dev/js/**/*', './public/js/**/*', './dev/html/**/*', './public/html/**/*', './dev/css/**/*', './public/css/**/*']);
    });

    gulp.task('run', ['clean'], function() {
        return runSequence(['lib', 'img', 'css', 'js'], ['revHtml'], ['watch']);
    });

    gulp.task('watch', function() {
        gulp.watch('src/lib/**/*', ['lib']);
        gulp.watch('src/css/**/*', ['css']);
        gulp.watch('src/img/**/*', ['img']);
        gulp.watch('src/js/**/*', ['run']);
        gulp.watch('src/html/*.html', ['revHtml']);
    });
    gulp.task('default', ['run']);
    gulp.task('build', ['run']); //定义默认任务 elseTask为其他任务，该示例没有定义elseTask任务
})();