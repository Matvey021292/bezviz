var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    include         = require('gulp-file-include'),
    autoprefixer    = require('gulp-autoprefixer'),
    browserSync     = require('browser-sync').create(),
    gcmq            = require('gulp-group-css-media-queries'),
    imagemin        = require('gulp-imagemin'),
    js              = require('gulp-js-import'),
    concat          = require('gulp-concat'),
    pngquant        = require('imagemin-pngquant'),
    cssnano         = require('gulp-cssnano'),
    cache           = require('gulp-cache'),
    uglify          = require('gulp-uglify'),
    rename          = require('gulp-rename');

gulp.task('html', function () {
    gulp.src(['src/*.html'])
        .pipe(include({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('build'))
});


gulp.task('sass', function () {
    return gulp.src('src/sass/*.s+(a|c)ss')
        .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
        .pipe(autoprefixer(['last 2 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest('build/css'))
});


gulp.task('scripts', function () {
    return gulp.src('src/js/*.js')
        .pipe(js())
        .pipe(gulp.dest('build/js'));
});

gulp.task('scriptsLibs', function () {
    return gulp.src('src/js/libs.min.js')
        .pipe(js())
        .pipe(gulp.dest('build/js'));
});

gulp.task('scriptsUtils', function () {
    return gulp.src('src/components/**/utils/*.js')
        .pipe(js())
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest('build/js/utils/'));
});

gulp.task('json', function () {
    return gulp.src('src/components/**/*.json')
    .pipe(rename({dirname: ''}))
        .pipe(gulp.dest('build'));
});

gulp.task('img-components', function () {
    return gulp.src('src/components/**/img/**/*.*')
        .pipe(rename({dirname: ''}))
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('build/img'));
});

gulp.task('folder-components', function () {
    return gulp.src(['src/components/**/**/*.+(gif|jpeg|jpg|png|mp3|mp4|ogv|webm)','!src/components/**/img'])
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest('build/img'));
});

gulp.task('img', function () {
    return gulp.src('src/img/**/*.+(jpeg|jpg|png|ico)')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('build/img'));
});

gulp.task('fonts', function () {
   return gulp.src('src/fonts/**/*.*')
       .pipe(gulp.dest('build/fonts'))
});

gulp.task('cssMin', function() {
    return gulp.src('build/css/*.css')
    .pipe(gcmq())
    .pipe(cssnano())
    .pipe(gulp.dest('build/css')); 
});

gulp.task('jsMin', function() {
    return gulp.src('build/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js')); 
});

gulp.task('min', ['cssMin', 'jsMin'], function() {
    
    var minCss = gulp.src([
        'build/css/*.css'
        ]).pipe(gulp.dest('build/css'));
    
    var minJs = gulp.src([
        'build/js/*.js',
        ]).pipe(gulp.dest('build/js'));

    process.exit();
});

browserSync.watch('build/**/*.*').on('change', browserSync.reload);

gulp.task('watch', ['browserSync', 'html', 'json','img-components', 'folder-components', 'img', 'fonts', 'sass', 'scriptsUtils', 'scriptsLibs', 'scripts'], function () {
    gulp.watch(['src/sass/*.s+(a|c)ss', 'src/components/**/*.s+(a|c)ss'], ['sass'], browserSync.reload);
    gulp.watch('src/fonts/**/*.*', ['fonts'], browserSync.reload);
    gulp.watch('src/components/**/*.json', ['json'], browserSync.reload);
    gulp.watch('src/components/**/img/*.*', ['img-components'], browserSync.reload);
    gulp.watch(['src/components/**/**/*.+(gif|jpeg|jpg|png|mp3|mp4|ogv|webm)','!src/components/**/img'], ['folder-components'], browserSync.reload);
    gulp.watch('src/components/**/*.html', ['html'], browserSync.reload);
    gulp.watch('src/*.html', ['html'], browserSync.reload);
    gulp.watch(['src/components/**/*.js', 'src/js/*.js'], ['scripts'], browserSync.reload);
    gulp.watch('src/libs/**/*.js', ['scriptsLibs'], browserSync.reload);
    gulp.watch('src/components/**/utils/*.js', ['scriptsUtils'], browserSync.reload);
});

gulp.task('default', ['watch']);

gulp.task('browserSync', function () {
    browserSync.init({
        open: true,
        server: {
            baseDir: 'build'
        }
    });
});