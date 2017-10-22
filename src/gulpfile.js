var gulp = require('gulp');
var sass = require('gulp-sass');
var pleeease = require("gulp-pleeease");
var plumber = require("gulp-plumber");
var browserSync = require("browser-sync");

gulp.task('scss', function() {
	gulp.src(["scss/**/*.scss","!scss/**/_*.scss"])
	.pipe(plumber())
    .pipe(sass())
    .pipe(pleeease({
        sass: true,
        autoprefixer: true,
        minifier: true,
        mqpacker: true
    }))
    .pipe(gulp.dest("css"));
});

gulp.task('browser-sync', function() {
    browserSync({
		notify: false,
		server:{baseDir: "./"}
    });
});

gulp.task('bs-reload',function(){
    browserSync.reload();
});

gulp.task("default",["browser-sync"], function() {
	gulp.watch("scss/**/*.scss",["scss"]);
	gulp.watch("index.html", ['bs-reload']);
	gulp.watch("css/**/*.css", ['bs-reload']);
	gulp.watch("js/**/*.js", ['bs-reload']);
});
