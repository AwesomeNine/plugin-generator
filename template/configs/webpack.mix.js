/* eslint-disable import/no-extraneous-dependencies */
// webpack.mix.js

const mix = require('laravel-mix');
const { join } = require('path');
const packageData = require('./package.json');

require('./tools/laravel-mix/wp-pot');
require('laravel-mix-tailwind')

// Webpack Config.
mix.webpackConfig({
	externals: {
		jquery: 'jQuery',
		lodash: 'lodash',
		moment: 'moment',
	},
});

// Aliasing Paths.
mix.alias({
	'@root': join(__dirname, 'assets/src'),
});

/**
 * Browsersync
 */
mix.browserSync({
	proxy: '{{wp.proxy}}',
	ghostMode: false,
	notify: false,
	ui: false,
	open: true,
	online: false,
	files: ['assets/css/*.min.css', 'assets/js/*.js', '**/*.php'],
});

/**
 * WordPress translation
 */
mix.wpPot({
	output: packageData.wpPot.output,
	file: packageData.wpPot.file,
	skipJS: true,
	domain: packageData.wpPot.domain,
});

/* That's all, start editing from here! */

/**
 * CSS
 */
mix.sass('assets/scss/app.scss', 'assets/css/app.css').tailwind()

/**
 * JavaScript
 */
mix.js('assets/src/app.js', 'assets/js/app.js')
