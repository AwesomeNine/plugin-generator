
/**
 * External dependencies
 */
const mix = require( 'laravel-mix' )

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
	'assets/scss/theme.scss',
	'assets/css/theme.css',
).sourceMaps( true )

/**
 * Browsersync
 */
mix.browserSync( {
	proxy: 'http://tights-no.vm/',
	ghostMode: false,
	notify: false,
	ui: false,
	open: false,
	online: false,
	files: [
		'assets/css/*.css',
		'assets/js/*.js',
		'**/*.php'
	],
} )
