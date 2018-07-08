var gulp = require('gulp');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mq4HoverShim = require('mq4-hover-shim');
var rimraf = require('rimraf').sync;
var browser = require('browser-sync');
var panini = require('panini');
var concat = require('gulp-concat');
var port = process.env.SERVER_PORT || 8080;
var bowerpath = process.env.BOWER_PATH || './bower_components/';

// Starts a BrowerSync instance
gulp.task('server', ['build'], function(){
  browser.init({server: './dist', port: port});
});

// Watch files for changes
gulp.task('watch', function() {
  gulp.watch('build/assets/scss/**/*', ['compile-sass']);
  gulp.watch('build/html/pages/**/*', ['compile-html']);
  gulp.watch(['build/html/{layouts,includes,helpers,data}/**/*'], ['compile-html:reset','compile-html']);
  gulp.watch('build/assets/scripts/*', ['compile-js', browser.reload]);
  gulp.watch('build/assets/fonts/**/*', ['copy', browser.reload]);
  gulp.watch('build/assets/images/**/*', ['copy', browser.reload]);
});

// Erases the dist folder
gulp.task('clean', function() {
  rimraf('dist');
});

// Copy assets
gulp.task('copy', function() {
    gulp.src(['build/assets/fonts/*']).pipe(gulp.dest('dist/assets/fonts'));
    gulp.src(['build/assets/images/**/*']).pipe(gulp.dest('dist/assets/images'));
});

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded',
  includePaths: bowerpath
};

gulp.task('compile-sass', function () {
    var processors = [
        mq4HoverShim.postprocessorFor({ hoverSelectorPrefix: '.bs-true-hover ' }),
        autoprefixer({
            browsers: [
              //
              // Official browser support policy:
              // http://v4-alpha.getbootstrap.com/getting-started/browsers-devices/#supported-browsers
              //
              'Chrome >= 35', // Exact version number here is kinda arbitrary
              // Rather than using Autoprefixer's native "Firefox ESR" version specifier string,
              // we deliberately hardcode the number. This is to avoid unwittingly severely breaking the previous ESR in the event that:
              // (a) we happen to ship a new Bootstrap release soon after the release of a new ESR,
              //     such that folks haven't yet had a reasonable amount of time to upgrade; and
              // (b) the new ESR has unprefixed CSS properties/values whose absence would severely break webpages
              //     (e.g. `box-sizing`, as opposed to `background: linear-gradient(...)`).
              //     Since they've been unprefixed, Autoprefixer will stop prefixing them,
              //     thus causing them to not work in the previous ESR (where the prefixes were required).
              'Firefox >= 31', // Current Firefox Extended Support Release (ESR)
              // Note: Edge versions in Autoprefixer & Can I Use refer to the EdgeHTML rendering engine version,
              // NOT the Edge app version shown in Edge's "About" screen.
              // For example, at the time of writing, Edge 20 on an up-to-date system uses EdgeHTML 12.
              // See also https://github.com/Fyrd/caniuse/issues/1928
              'Edge >= 12',
              'Explorer >= 9',
              // Out of leniency, we prefix these 1 version further back than the official policy.
              'iOS >= 8',
              'Safari >= 8',
              // The following remain NOT officially supported, but we're lenient and include their prefixes to avoid severely breaking in them.
              'Android 2.3',
              'Android >= 4',
              'Opera >= 12'
            ]
          })//,
        //cssnano(),
    ];
    return gulp.src('./build/assets/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/assets/css/'));
});

gulp.task('compile-html', function() {
  gulp.src('build/html/pages/**/*.html')
    .pipe(panini({
      root: 'build/html/pages/',
      layouts: 'build/html/layouts/',
      partials: 'build/html/includes/',
      helpers: 'build/html/helpers/',
      data: 'build/html/data/'
    }))
    .pipe(gulp.dest('dist'))
    .on('finish', browser.reload);
});

gulp.task('compile-html:reset', function(done) {
  panini.refresh();
  done();
});

gulp.task('compile-js', function() {
  return gulp.src([bowerpath+ 'jquery/dist/jquery.min.js',
      bowerpath+ 'tether/dist/js/tether.min.js',
      bowerpath+ 'bootstrap-sass/assets/javascripts/bootstrap.min.js',
      bowerpath+ 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js',
      bowerpath+ 'owl.carousel/dist/owl.carousel.js',
      bowerpath+ 'vide/dist/jquery.vide.min.js',
      bowerpath+ 'iCheck/icheck.min.js',
      bowerpath+ 'jquery-mask-plugin/dist/jquery.mask.min.js',
      './build/assets/scripts/main.js'
  ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/assets/scripts/'));
});


gulp.task('build', ['clean','copy','compile-js','compile-sass','compile-html']);
gulp.task('default', ['server', 'watch']);
