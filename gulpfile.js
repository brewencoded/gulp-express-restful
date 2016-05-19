const gulp = require('gulp'),
    changed = require('gulp-changed'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    mocha = require('gulp-mocha'),
    util = require('gulp-util'),
    nodemon = require('gulp-nodemon');

const src = {
    index: './index.js',
    server: './api/**/*.js',
    routes: './api/routes/**/*.js',
    config: './api/config.js',
    test: './test/**/*.js'
};

const dest = {
};

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
gulp.task('mocha', ['watch'], () => {
    return gulp.src(src.test, {read: false})
        .pipe(mocha({reporter: 'spec'}))
        .on('error', util.log);
});

///////////////////////////////////////////////////////
// start node server and reload on server file changes
///////////////////////////////////////////////////////
gulp.task('start-server', ['jshint'], () => {
    nodemon({
        script: 'index.js',
        ext: 'js',
        env: { 'NODE_ENV': 'development' }
    })
    .on('restart', () => {
        util.log(util.colors.magenta('server restarted'));
    });
});

///////////////////////////////////////////////////////
// watch development files
///////////////////////////////////////////////////////
gulp.task('watch', ['start-server'], () => {
    gulp.watch([src.index, src.server, '!' + src.config], ['test']);
});

///////////////////////////////////////////////////////
// set tasks to call from scripts
///////////////////////////////////////////////////////
gulp.task('dev', ['mocha', 'watch']);
gulp.task('test', ['jshint', 'mocha']);
