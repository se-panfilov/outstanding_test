var gulp = require('gulp'), concat, rename, uglify, jade, sourcemaps, changed, minifyHTML, stylus,
    minifyCss, nib, jshint, buddyjs, htmlhint, templateCache, ngAnnotate;

var src = {
    stylesDirs: [
        'src/common_styles/**/*.styl',
        'src/modules/**/*.styl',
        'src/pages/**/*.styl',
        'src/partials/**/*.styl',
        '*.styl'
    ],
    jade: [
        'index.jade',
        'src/pages/**/*.jade',
        'src/partials/**/*.jade',
        'src/modules/**/*.jade'
    ],
    jsDir: 'src/**/*.js'
};

var dest = {
    staticDir: 'static',
    dist: 'dist',
    templatesDir: 'templates'
};

gulp.task('lint', function () {
    jshint = jshint || require('gulp-jshint');

    return gulp.src(src.jsDir)
        .pipe(jshint({
            globalstrict: true,
            strict: false,
            globals: {
                angular: true,
                localStorage: true,
                console: true
            }
        }))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('magic_numbers', function () {
    buddyjs = buddyjs || require('gulp-buddy.js');

    return gulp.src(src.jsDir)
        .pipe(buddyjs({
            ignore: [0, 1, 2],
            reporter: 'detailed'
        }));
});

gulp.task('htmlhint', function () {
    htmlhint = htmlhint || require("gulp-htmlhint");
    jade = jade || require('gulp-jade');

    var html = src.jade.staticDirs.templates.concat(src.jade.staticDirs.main);
    html.push(src.jade.templatesDir);
    return gulp.src(html)
        .pipe(jade({pretty: false}))
        .pipe(htmlhint({
            "tagname-lowercase": true,
            "attr-lowercase": true,
            "attr-value-double-quotes": true,
            "doctype-first": false,
            "tag-pair": true,
            "spec-char-escape": true,
            "id-unique": true,
            "src-not-empty": true,
            "attr-no-duplication": true
        }))
        .pipe(htmlhint.reporter())
});

gulp.task('js', function () {
    sourcemaps = sourcemaps || require('gulp-sourcemaps');
    uglify = uglify || require('gulp-uglify');
    rename = rename || require('gulp-rename');
    ngAnnotate = ngAnnotate || require('gulp-ng-annotate');
    changed = changed || require('gulp-changed');
    concat = concat || require('gulp-concat');

    return gulp.src([src.jsDir])
        .pipe(changed(dest.staticDir))
        .pipe(concat('app.js'))
        .pipe(ngAnnotate({remove: true, add: true, single_quotes: true}))
        .pipe(gulp.dest(dest.dist))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({basename: 'app.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest.dist))
        ;
});

gulp.task('jade', function () {
    templateCache = templateCache || require('gulp-angular-templatecache');
    changed = changed || require('gulp-changed');
    minifyHTML = minifyHTML || require('gulp-minify-html');
    jade = jade || require('gulp-jade');
    concat = concat || require('gulp-concat');

    return gulp.src(src.jade)
        .pipe(changed(dest.staticDir, {extension: '.html'}))
        .pipe(jade({pretty: false}))
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(templateCache({
            module: 'app.templates',
            standalone: true
        }))
        .pipe(concat('app_templates.js'))
        .pipe(gulp.dest(dest.dist))

});

gulp.task('stylus', function () {
    stylus = stylus || require('gulp-stylus');
    minifyCss = minifyCss || require('gulp-minify-css');
    nib = nib || require('nib');
    changed = changed || require('gulp-changed');
    concat = concat || require('gulp-concat');

    return gulp.src(src.stylesDirs, {base: 'static'})
        //TODO (S.Panfilov) check changed
        .pipe(changed(dest.dist))
        .pipe(concat('app.min.styl'))
        .pipe(stylus({use: [nib()], compress: true}))
        .pipe(minifyCss())
        .pipe(gulp.dest(dest.dist));
});

gulp.task('purify_css', function () {
    return purifyCss({
        src: ['index.html', 'maintenance.html', 'dist/app.min.js', 'dist/app_templates.js', 'dist/vendor.min.js'],
        css: ['dist/vendor.min.css'],
        output: 'dist/vendor.purified.min.css'
    });
});

function purifyCss(settings) {
    var fs = require('fs');
    var purify = require('purify-css');
    var pure = purify(settings.src, settings.css, {write: false, info: true});

    fs.writeFile(settings.output, pure, function (err) {
        if (err) return err;
    });
}

gulp.task('vendor_js', function () {
    sourcemaps = sourcemaps || require('gulp-sourcemaps');
    uglify = uglify || require('gulp-uglify');
    rename = rename || require('gulp-rename');
    concat = concat || require('gulp-concat');

    return gulp.src([
        //'libs/bower_components/angular/angular.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(dest.dist))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({basename: 'vendor.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest.dist))
});

gulp.task('vendor_css', function () {
    minifyCss = minifyCss || require('gulp-minify-css');
    var concatVendorCss = require('gulp-concat-css');

    gulp.src([
        'libs/bower_components/bootstrap/dist/css/bootstrap.min.css',
        'libs/bower_components/font-awesome/css/font-awesome.min.css',
        'libs/bower_components/angular-loading-bar/build/loading-bar.min.css'
    ], {base: 'dist'})
        .pipe(concatVendorCss('vendor.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(dest.dist));
});

gulp.task('watch', function () {
    var watch = require('gulp-watch');

    gulp.watch(src.jade, ['jade_static_main']);
    gulp.watch(src.stylesDirs, ['stylus']);
    gulp.watch([src.jsDir], ['js']);
});

gulp.task('build_vendor', function () {
    gulp.start('vendor_js');
    gulp.start('vendor_css');
    gulp.start('purify_css');
});

gulp.task('build', function () {
    gulp.start('jade');
    gulp.start('js');
    gulp.start('stylus');
    gulp.start('purify_css');
});

gulp.task('default', function () {
    gulp.start('build');
    gulp.start('watch');
});
