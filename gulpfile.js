var gulp = require("gulp");
var amdOptimize = require("amd-optimize");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins();

path = {
    html: ['demo/**/*.html'],
    scripts: ['app/**/*.js'],
    scss: ['app/**/*.scss', '!app/library/vendor/**/*.scss'],
    less: ['app/**/*.less', '!app/library/**/*.less'],
    css: 'app/**/*/documentation/**/*.css',
    images: 'app/**/*.png'
};


gulp.task("scripts:calendar", function () {

    return gulp.src("src/scripts/**/*.js")
        // Traces all modules and outputs them in the correct order.
        .pipe(amdOptimize("calendar", {
            paths: {
                "moment": "empty:",
                "event_machine": "library/event_machine"
            }
        }))
        .pipe(concat("calendar.js"))
        .pipe(gulp.dest("dist/scripts"));

});

gulp.task("scripts:dateRangePicker", function () {

    return gulp.src("src/scripts/**/*.js")
        // Traces all modules and outputs them in the correct order.
        .pipe(amdOptimize("date_range_picker", {
            paths: {
                "moment": "empty:",
                "event_machine": "library/event_machine"
            }
        }))
        .pipe(concat("date_range_picker.js"))
        .pipe(gulp.dest("dist/scripts"));

});

gulp.task("scripts:calendarMin", function () {

    return gulp.src("src/scripts/**/*.js")
        // Traces all modules and outputs them in the correct order.
        .pipe(amdOptimize("calendar", {
            paths: {
                "moment": "empty:",
                "event_machine": "library/event_machine"
            }
        }))
        .pipe(concat("calendar_min.js"))
        .pipe(uglify("calendar_min.js"))
        .pipe(gulp.dest("dist/scripts"));

});

gulp.task("scripts:dateRangePickerMin", function () {

    return gulp.src("src/scripts/**/*.js")
        // Traces all modules and outputs them in the correct order.
        .pipe(amdOptimize("date_range_picker", {
            paths: {
                "moment": "empty:",
                "event_machine": "library/event_machine"
            }
        }))
        .pipe(concat("date_range_picker_min.js"))
        .pipe(uglify("date_range_picker_min.js"))
        .pipe(gulp.dest("dist/scripts"));

});

plugins.sass({}).on('error', function (e) {
    console.log(e);
    plugins.sass({}).end();
});

gulp.task('sassToCSS', function() {
    gulp.src('src/styles/**/*.scss')
        .pipe(plugins.sass({}))
        .pipe(gulp.dest('dist/styles'));
});

gulp.task("sassToCSSCalendarMin", function () {
    gulp.src('src/styles/calendar.scss')
        .pipe(plugins.sass({}))
        .pipe(minifyCSS({keepBreaks:false}))
        .pipe(plugins.rename('calendar_min.css'))
        .pipe(gulp.dest('dist/styles'));
});
gulp.task("sassToCSSDateRangePickerMin", function () {
    gulp.src('src/styles/date_range_picker.scss')
        .pipe(plugins.sass({}))
        .pipe(minifyCSS({keepBreaks:false}))
        .pipe(plugins.rename('date_range_picker_min.css'))
        .pipe(gulp.dest('dist/styles'));
});
gulp.task('images', function() {
    return gulp.src('src/css/images/**/*')
        // Pass in options to the task
        .pipe(plugins.imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('dist/styles/images'));
});

gulp.task('serve', function () {
    plugins.connect.server({
        port: 9000,
        root: '.temp'
    });
});

gulp.task("documentation", function () {
    gulp.src(path.scripts)
        .pipe(plugins.jsdoc('documentation'));
});
gulp.task('copyJS', function () {
    gulp.src(path.scripts)
        .pipe(gulp.dest('.temp'));
});

gulp.task('copyHTML', function () {
    gulp.src(path.html)
        .pipe(gulp.dest('.temp'));
});
gulp.task('copyCSS', function() {
    gulp.src(path.scss)
        .pipe(plugins.sass({}))
        .pipe(gulp.dest('.temp'));
});
gulp.task('build', ['scripts:calendar', 'scripts:dateRangePicker',
    'scripts:calendarMin', 'scripts:dateRangePickerMin',
    'sassToCSS', 'sassToCSSCalendarMin', 'sassToCSSDateRangePickerMin']);
gulp.task('watch', function () {
    gulp.watch('src/scripts', ['copyJS']);
    gulp.watch('demo', ['copyHTML']);
    gulp.watch('src/css', ['copyCSS']);
});
var deploy = require('gulp-gh-pages');
var options = {
    //remoteUrl: "https://github.com/TopQualityUA/TeamvoyFrontend.git",
    branch: "gh-pages"};
/**
 * Push build to gh-pages
 */
gulp.task('deploy', function () {
    return gulp.src(["./dist/**/*","./demo/**/*", "./documentation/**/*",
        "./library/vendor/**/*"])
        .pipe(deploy(options));
});