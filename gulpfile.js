// gulpfile.js
const gulp = require('gulp');
// const babel = require('babelify');
const babel = require("babel-core");
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const notify = require('gulp-notify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');
 
gulp.task('pug',function() {
    return gulp.src('./dev/views/*.pug')
    .pipe(pug({
       doctype: 'html',
       pretty: false
    }))
    .pipe(gulp.dest('./'));
   });

gulp.task('styles', () => {
    return gulp.src('./dev/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./public/styles'))
});

gulp.task('js', () => {
    browserify('dev/scripts/app.js', {debug: true})
        // .transform('babelify', {
        //     sourceMaps: true,
        //     presets: ['env','react']
        // })
        .bundle()
        .on('error',notify.onError({
            message: "Error: <%= error.message %>",
            title: 'Error in JS 💀'
        }))
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest('public/scripts'))
        .pipe(reload({stream:true}));
});

gulp.task('bs', () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('default', ['pug','js','bs', 'styles'], () => {
    gulp.watch('dev/**/*.pug',['pug']);
    gulp.watch('dev/**/*.js',['js']);
    gulp.watch('dev/**/*.scss',['styles']);
    gulp.watch('./public/styles/style.css',reload);
    gulp.watch('index.html', reload);

});