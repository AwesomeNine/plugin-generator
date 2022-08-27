/**
 * External dependencies
 */
const mix = require( 'laravel-mix' )
require( 'laravel-mix-tailwind' )

/**
 * Webpack Config
 */
mix.webpackConfig(
	{
		externals: {
			jquery: 'jQuery'
		}
	}
)

/**
 * CSS
 */
mix.sass(
	'assets/scss/app.scss',
	'assets/css/app.css',
).tailwind()

/**
 * JavaScript
 */
mix.js(
	'assets/src/app.js',
	'assets/js/app.js',
)

/**
 * Browsersync
 */
mix.browserSync( {
	proxy: '{{wp.proxy}}',
	ghostMode: false,
	notify: false,
	ui: false,
	open: true,
	online: false,
	files: [
		'assets/css/*.css',
		'assets/js/*.js',
		'**/*.php'
	],
} )
