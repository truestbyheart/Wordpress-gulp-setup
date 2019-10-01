import gulp from 'gulp';
import browserSync from 'browser-sync';
import scss from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin';
import changed  from 'gulp-changed';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import lineec from 'gulp-line-ending-corrector';
import autoprefixer from 'gulp-autoprefixer';

browserSync.create();
const  reload = browserSync.reload;
/** Add your wordpress them name here**/
const themename = '';

const root = '../'+themename+'/';
const sass = root + 'sass/';
const js = root + 'js/';

const jsDist = root+ 'dist/';

const phpWatchFiles = root + '**/*.php';
const styleWatchFiles = root + '**/*.scss';

const jsSource =[ js + 'customizar.js',js + 'navigation.js',js + 'skip-link-focus-fix.js' ];

const imgSource = root + 'src/images/*';
const imgDestination = root+ 'dist/images';

const css = () => (
    gulp.src([sass + 'style.scss'])
        .pipe(sourcemaps.init({loadMaps: true }))
        .pipe(sass({
            outputStyle: 'expanded'
        })).on('error', sass.logError)
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sourcemaps.write())
        .pipe(lineec())
        .pipe(gulp.dest(root))

);

const jsTask = () => (
    gulp.src(jsSource)
        .pipe(concat('devwp.js'))
        .pipe(uglify())
        .pipe(lineec())
        .pipe(gulp.dest(jsDist))
);

const imgmin = () =>(
    gulp.src(imgSource)
        .pipe(changed(imgDestination))
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest(imgDestination))

);

const watch = () => {
    browserSync.init({
        open: 'external'
        /** add the link to your wordpress setup here
         * e.g http://localhost/wordpress
         * **/
        proxy: '',
        port: 8080
    });
    gulp.watch(styleWatchFiles,gulp.series([css]));
    gulp.watch(jsSource, jsTask);
    gulp.watch(imgSource, imgmin);
    gulp.watch([phpWatchFiles,jsDist+ 'devwp.js']).on('change', browserSync.reload);
};


exports.css = css;
exports.jsTask = jsTask;
exports.imgmin = imgmin;
exports.watch = watch;

const build = gulp.series(watch);
gulp.task('default', build);