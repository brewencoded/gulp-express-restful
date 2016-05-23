const gulp = require('gulp'),
    changed = require('gulp-changed'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    mocha = require('gulp-mocha'),
    util = require('gulp-util'),
    nodemon = require('gulp-nodemon'),
    env = require('gulp-env');

const src = {
    index: './index.js',
    server: './api/**/*.js',
    routes: './api/routes/**/*.js',
    config: './api/config.js',
    test: './test/**/*.js'
};

const dest = {};

///////////////////////////////////////////////////////
// check for syntax and code style issues
///////////////////////////////////////////////////////
gulp.task('jshint', () => {
    return gulp.src([src.index, src.server, '!' + src.config])
        .pipe(changed(src.server))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

///////////////////////////////////////////////////////
// test code
///////////////////////////////////////////////////////
gulp.task('mocha', () => {
    return gulp.src(src.test, {
            read: false
        })
        .pipe(mocha({
            reporter: 'spec'
        }))
        .on('error', util.log);
});

///////////////////////////////////////////////////////
// start node server and reload on server file changes
///////////////////////////////////////////////////////
gulp.task('start-server', ['jshint', 'watch'], () => {
    return nodemon({
            script: 'index.js',
            ext: 'js',
            env: {
                NODE_ENV: 'development',
                PORT: 8000
            }
        })
        .on('restart', () => {
            util.log(util.colors.magenta('server restarted'));
        });
});

///////////////////////////////////////////////////////
// watch development files
///////////////////////////////////////////////////////
gulp.task('watch', () => {
    gulp.watch([src.index, src.server, '!' + src.config], ['jshint']);
});

///////////////////////////////////////////////////////
// set tasks to call from scripts
///////////////////////////////////////////////////////
gulp.task('dev', ['start-server']);
gulp.task('test', ['jshint', 'mocha']);
