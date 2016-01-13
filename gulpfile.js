var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    jsfiles = ['*.js', 'src/**/*.js'];

gulp.task('style', function () {
    return gulp.src(jsfiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish',
            {
                verbose: true
            }))
        .pipe(jscs());
});

gulp.task('inject', function () {
    var wiredep = require('wiredep').stream,
        inject = require('gulp-inject'),
        options = {
            bowerJson: require('./bower.json'),
            directory: './public/lib',
            ignorePath: '../../public/'
        },
        injectsrc = gulp.src([
            './public/css/*.css',
            './public/js/*.js'
        ], { read: false }),
        injectOptions = {
            ignorePath: '/public'
        };

    return gulp.src(['./src/views/partials/*.ejs'])
        .pipe(wiredep(options))
        .pipe(inject(injectsrc, injectOptions))
        .pipe(gulp.dest('./src/views/partials'));
});

gulp.task('serve', ['style', 'inject'], function () {
    var options = {
        script: 'app.js',
        delayTime: 1,
        env: {
            'PORT': 5000
        },
        watch: jsfiles
    };

    return nodemon(options)
        .on('restart', function (ev) {
            console.info('Restarting...');
        });
});

gulp.task('test', function () {
    var appDir = './public/css';
    return gulp.src([
        appDir + '/*.css',
        appDir + '/*.scss',
        appDir + '/**/*.scss'
    ])
        .pipe(sass())
        .pipe(gulp.dest('./build/css/'));
});