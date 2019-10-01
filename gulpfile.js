"use strict";

var _gulp = _interopRequireDefault(require("gulp"));

var _browserSync = _interopRequireDefault(require("browser-sync"));

var _gulpSass = _interopRequireDefault(require("gulp-sass"));

var _gulpCleanCss = _interopRequireDefault(require("gulp-clean-css"));

var _gulpConcat = _interopRequireDefault(require("gulp-concat"));

var _gulpImagemin = _interopRequireDefault(require("gulp-imagemin"));

var _gulpChanged = _interopRequireDefault(require("gulp-changed"));

var _gulpUglify = _interopRequireDefault(require("gulp-uglify"));

var _gulpSourcemaps = _interopRequireDefault(require("gulp-sourcemaps"));

var _gulpLineEndingCorrector = _interopRequireDefault(require("gulp-line-ending-corrector"));

var _gulpAutoprefixer = _interopRequireDefault(require("gulp-autoprefixer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_browserSync["default"].create();

var reload = _browserSync["default"].reload;
var themename = 'humescores';
var root = '../' + themename + '/';
var sass = root + 'sass/';
var js = root + 'js/';
var jsDist = root + 'dist/';
var phpWatchFiles = root + '**/*.php';
var styleWatchFiles = root + '**/*.scss';
var jsSource = [js + 'customizar.js', js + 'navigation.js', js + 'skip-link-focus-fix.js'];
var imgSource = root + 'src/images/*';
var imgDestination = root + 'dist/images';

var css = function css() {
  return _gulp["default"].src([sass + 'style.scss']).pipe(_gulpSourcemaps["default"].init({
    loadMaps: true
  })).pipe(sass({
    outputStyle: 'expanded'
  })).on('error', sass.logError).pipe((0, _gulpAutoprefixer["default"])('last 2 versions')).pipe(_gulpSourcemaps["default"].write()).pipe((0, _gulpLineEndingCorrector["default"])()).pipe(_gulp["default"].dest(root));
};

var jsTask = function jsTask() {
  return _gulp["default"].src(jsSource).pipe((0, _gulpConcat["default"])('devwp.js')).pipe((0, _gulpUglify["default"])()).pipe((0, _gulpLineEndingCorrector["default"])()).pipe(_gulp["default"].dest(jsDist));
};

var imgmin = function imgmin() {
  return _gulp["default"].src(imgSource).pipe((0, _gulpChanged["default"])(imgDestination)).pipe((0, _gulpImagemin["default"])([_gulpImagemin["default"].gifsicle({
    interlaced: true
  }), _gulpImagemin["default"].jpegtran({
    progressive: true
  }), _gulpImagemin["default"].optipng({
    optimizationLevel: 5
  })])).pipe(_gulp["default"].dest(imgDestination));
};

var watch = function watch() {
  _browserSync["default"].init({
    open: 'external',
    proxy: 'http://127.0.0.1:888/wordpress',
    port: 8080
  });

  _gulp["default"].watch(styleWatchFiles, _gulp["default"].series([css]));

  _gulp["default"].watch(jsSource, jsTask);

  _gulp["default"].watch(imgSource, imgmin);

  _gulp["default"].watch([phpWatchFiles, jsDist + 'devwp.js']).on('change', _browserSync["default"].reload);
};

exports.css = css;
exports.jsTask = jsTask;
exports.imgmin = imgmin;
exports.watch = watch;

var build = _gulp["default"].series(watch);

_gulp["default"].task('default', build);
