/* DEV configuration - octobre 2020 */

const gulp          = require('gulp')
    ,   browserSync = require('browser-sync').create()
    ,   sass        = require('gulp-sass')(require('sass'))
    ,   plugins     = require('gulp-load-plugins')()
    // ,   source      = require('vinyl-source-stream')
    // ,   buffer      = require('vinyl-buffer')
    // ,   rollup      = require('@rollup/stream')
    // ,   commonjs    = require('@rollup/plugin-commonjs')
    // ,   nodeResolve = require('@rollup/plugin-node-resolve');

var cache;

// gulp.task('js', function() {
//     return rollup({
//         // Point to the entry file
//         input: './src/scripts/main.js',
  
//         // Apply plugins
//         plugins: [commonjs(), nodeResolve()],
  
//         // Use cache for better performance
//         cache: cache,
  
//         // Note: these options are placed at the root level in older versions of Rollup
//         output: {
  
//           // Output bundle is intended for use in browsers
//           // (iife = "Immediately Invoked Function Expression")
//           format: 'iife',
  
//           // Show source code when debugging in browser
//           sourcemap: true
  
//         }
//       })
//       .on('bundle', function(bundle) {
//         // Update cache data after every bundle is created
//         cache = bundle;
//       })
//       // Name of the output file.
//       .pipe(source('bundle.js'))
//       .pipe(buffer())
  
//       // The use of sourcemaps here might not be necessary, 
//       // Gulp 4 has some native sourcemap support built in
//       .pipe(plugins.sourcemaps.init())
//       .pipe(plugins.sourcemaps.write())
   
//       // Where to send the output file
//       .pipe(gulp.dest('./src/build/js'))
// });

gulp.task('src-pre', function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(plugins.sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest("./src/styles"));
        // .pipe(browserSync.stream());
});

gulp.task('dist-css-js', function(){
    return gulp.src('./src/*.html')
    .pipe(plugins.useref())
    // .pipe(plugins.if('*.js', plugins.babel()))
    .pipe(plugins.if('./src/*.js', plugins.terser()))
    .pipe(plugins.if('./src/*.css', plugins.cssnano()))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('dist-images', function () {
    var srcImagesDest = 'images',
        distImagesDest = 'dist/img';
    // 480, 600, 640, 720, 768, 800, 960, 1024, 1080, 1280, 1440, 1536, 1600, 1920, 2048, 2560, 3440, 4096
    return gulp
        .src('/img/*.{png,jpg,tiff}')
        .pipe(plugins.newer(distImagesDest)
        .pipe(plugins.responsive({
              '*': [
                {width: 480, rename: { suffix: '-480w', extname: '.jpg'}},
                {width: 480, rename: { suffix: '-480w', extname: '.webp'}},
                {width: 600, rename: { suffix: '-600w', extname: '.jpg'}},
                {width: 600, rename: { suffix: '-600w', extname: '.webp'}},
                {width: 640, rename: { suffix: '-640w', extname: '.jpg'}},
                {width: 640, rename: { suffix: '-640w', extname: '.webp'}},
                {width: 720, rename: { suffix: '-720w', extname: '.jpg'}},
                {width: 720, rename: { suffix: '-720w', extname: '.webp'}},
                {width: 768, rename: { suffix: '-768w', extname: '.jpg'}},
                {width: 768, rename: { suffix: '-768w', extname: '.webp'}},
                {width: 800, rename: { suffix: '-800w', extname: '.jpg'}},
                {width: 800, rename: { suffix: '-800w', extname: '.webp'}},
                {width: 960, rename: { suffix: '-960w', extname: '.jpg'}},
                {width: 960, rename: { suffix: '-960w', extname: '.webp'}},
                {width: 1024, rename: { suffix: '-1024w', extname: '.jpg'}},
                {width: 1024, rename: { suffix: '-1024w', extname: '.webp'}},
                {width: 1080, rename: { suffix: '-1080w', extname: '.jpg'}},
                {width: 1080, rename: { suffix: '-1080w', extname: '.webp'}},
                {width: 1280, rename: { suffix: '-1280w', extname: '.jpg'}},
                {width: 1280, rename: { suffix: '-1280w', extname: '.webp'}},
                {width: 1366, rename: { suffix: '-1366w', extname: '.jpg'}},
                {width: 1366, rename: { suffix: '-1366w', extname: '.webp'}},
                {width: 1440, rename: { suffix: '-1440w', extname: '.jpg'}},
                {width: 1440, rename: { suffix: '-1440w', extname: '.webp'}},
                {width: 1536, rename: { suffix: '-1536w', extname: '.jpg'}},
                {width: 1536, rename: { suffix: '-1536w', extname: '.webp'}},
                {width: 1600, rename: { suffix: '-1600w', extname: '.jpg'}},
                {width: 1600, rename: { suffix: '-1600w', extname: '.webp'}},
                {width: 1920, rename: { suffix: '-1920w', extname: '.jpg'}},
                {width: 1920, rename: { suffix: '-1920w', extname: '.webp'}},
                {width: 2048, rename: { suffix: '-2048w', extname: '.jpg'}},
                {width: 2048, rename: { suffix: '-2048w', extname: '.webp'}},
                {width: 2560, rename: { suffix: '-2560w', extname: '.jpg'}},
                {width: 2560, rename: { suffix: '-2560w', extname: '.webp'}},
                {width: 3440, rename: { suffix: '-3440w', extname: '.jpg'}},
                {width: 3440, rename: { suffix: '-3440w', extname: '.webp'}},
              ]
            },
            {
              quality: 75,
              progressive: true,
              withMetadata: false,
              errorOnEnlargement: false,
              withoutEnlargement: false
            })
      ))
      .pipe(gulp.dest(srcImagesDest))
      .pipe(gulp.dest(distImagesDest))
});

gulp.task('dist-videos', function() {
    return gulp.src('/videos/**/*')
        .pipe(gulp.dest('dist/videos'))
});

gulp.task('dist-webfonts', function() {
    return gulp.src('/webfonts/**/*')
        .pipe(gulp.dest('dist/webfonts'))
});

// Server Tasks
gulp.task('src-dev-serve-images', gulp.series(['src-pre', 'dist-css-js', 'dist-images', 'dist-videos', 'dist-webfonts'], function() {
    browserSync.init({
        server: "src"
    });

    gulp.watch("./src/scss/**/*.scss", gulp.series('src-pre'));
    gulp.watch("./src/**/*.{html,js,css}", gulp.series('dist-css-js'));
    gulp.watch("./src/images/**/*.{png,jpg,tiff}", gulp.series('dist-images'));
    gulp.watch("./src/videos/**/*.{mp4,webm}", gulp.series('dist-videos'));
    gulp.watch("./src/webfonts/**/*", gulp.series('dist-webfonts'));
    gulp.watch("./src/**/*.html").on('change', browserSync.reload);
}));

gulp.task('src-dev-serve', gulp.series(['src-pre', 'dist-css-js', 'dist-videos', 'dist-webfonts'], function() {
    browserSync.init({
        server: "src",
        open: false
    });

    gulp.watch("./src/scss/**/*.scss", gulp.series('src-pre'));
    gulp.watch("./src/**/*.{html,js,css}", gulp.series('dist-css-js'));
    // gulp.watch('./src/**/!(bundle.js)*.js', gulp.series('js'));
    gulp.watch("./src/videos/**/*.{mp4,webm}", gulp.series('dist-videos'));
    gulp.watch("./src/webfonts/**/*", gulp.series('dist-webfonts'));
    gulp.watch("./src/**/*.html").on('change', browserSync.reload);
}));

gulp.task('dist-dev-serve', gulp.series(['src-pre', 'dist-css-js', 'dist-videos', 'dist-webfonts'], function() {
    browserSync.init({
        server: "dist"
    });

    gulp.watch("./src/scss/**/*.scss", gulp.series('src-pre'));
    gulp.watch("./src/**/*.{html,js,css}", gulp.series('dist-css-js'));
    gulp.watch("./src/videos/**/*.{mp4,webm}", gulp.series('dist-videos'));
    gulp.watch("./src/webfonts/**/*", gulp.series('dist-webfonts'));
    gulp.watch("./src/**/*.html").on('change', browserSync.reload);
}));

gulp.task('src-serve', gulp.series('src-pre', function() {
    browserSync.init({
        server: "src"
    });

    gulp.watch("./src/scss/**/*.scss", gulp.series('src-pre'));
}));

// Server Launch Tasks
gulp.task('default', gulp.series(['src-dev-serve']));

gulp.task('dev-images', gulp.series(['src-dev-serve-images']));

gulp.task('dev', gulp.series(['src-dev-serve']));

gulp.task('src', gulp.series(['src-serve']));

gulp.task('dist', gulp.series(['dist-dev-serve']));