const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require("gulp-rename");
const wbBuild = require('workbox-build');
const fs = require('fs');
const crypto = require('crypto');

function getHash(string) {
	const md5 = crypto.createHash('md5');
	md5.update(string);
	return md5.digest('hex');
}

gulp.task('move-workbox', function() {
	return gulp.src('./node_modules/workbox-sw/build/importScripts/workbox-sw.prod.v*.*.*.js')
		.pipe(rename('workbox.js'))
		.pipe(gulp.dest('./public/js/dist/'));
});

gulp.task('generate-wb-manifest', function () {
	return wbBuild.injectManifest({
		swSrc: './public/js/src/precache-worker.js',
		swDest: './public/js/dist/precache-worker.js',
		globDirectory: './node_modules/todomvc/examples/vanillajs',
		globIgnores: ['**/test/*'],
		globPatterns: ['**\/*.{html,js,css,png,json}'],
		manifestTransforms: [
			(entries) => entries.map((entry) => {
				if (entry.url.match(/app.js$/)) {
					entry.revision = getHash(fs.readFileSync('./public/js/dist/app.js'))
				} else if (entry.url.match(/index.html$/)) {
					entry.revision = getHash(fs.readFileSync('./public/index.html'))
				}
				return entry;
			})
		]
	});
});

gulp.task('service-worker', ['move-workbox', 'generate-wb-manifest'], function() {
	return gulp.src(['./public/js/dist/precache-worker.js', './public/js/src/push-worker.js'])
		.pipe(concat('sw.js'))
		.pipe(gulp.dest('./public/js/dist'));
});

gulp.task('app', function() {
	return gulp.src(['./public/js/src/app.js', './public/js/src/push-subscription.js'])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./public/dist'));
});

gulp.task('build', ['app', 'service-worker']);