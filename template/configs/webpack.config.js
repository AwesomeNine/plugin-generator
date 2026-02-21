/**
 * External Dependencies
 */
const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const { getWebpackEntryPoints } = require( '@wordpress/scripts/utils/config' );

const isProduction = process.env.NODE_ENV === 'production';

if ( ! isProduction ) {
	defaultConfig.devServer.allowedHosts = 'all';
}

// const rootPath = path.resolve(__dirname);
const basePath = path.resolve( __dirname, 'src' );

module.exports = {
	...defaultConfig,
	module: {
		...defaultConfig.module,
		rules: defaultConfig.module.rules.map( ( rule ) => {
			// Check if this rule handles CSS files
			if ( rule.test && rule.test.test && rule.test.test( '.css' ) ) {
				return {
					...rule,
					use: Array.isArray( rule.use )
						? rule.use.map( ( useEntry ) => {
								// Handle both string and object loader formats
								const loaderName =
									typeof useEntry === 'string'
										? useEntry
										: useEntry.loader;

								// Only modify css-loader, not postcss-loader
								if (
									loaderName &&
									loaderName.includes( 'css-loader' ) &&
									! loaderName.includes( 'postcss' )
								) {
									return {
										loader: loaderName,
										options: {
											...( typeof useEntry === 'object'
												? useEntry.options
												: {} ),
											url: false, // Disable all URL processing
										},
									};
								}
								return useEntry;
						  } )
						: rule.use,
				};
			}
			return rule;
		} ),
	},
	externals: {
		...defaultConfig.externals,

		// Global.
		window: 'window',
		jquery: 'jQuery',
		lodash: 'lodash',
		moment: 'moment',

		// WordPress.
		'@wordpress/dom-ready': 'wp.domReady',
		'@wordpress/hooks': 'wp.hooks',
	},
	resolve: {
		...defaultConfig.resolve,
		alias: {
			...defaultConfig.resolve.alias,
			'@root': path.join( __dirname, 'src' ),
			'@components': path.join( __dirname, 'src/components' ),
			'@utilities': path.join( __dirname, 'src/utilities' ),
		},
	},
	entry: {
		...getWebpackEntryPoints(),
		// Backend.
		// 'screen-onboarding': path.join(
		// 	basePath,
		// 	'admin/screen-onboarding/onboarding.js'
		// ),
	},
	output: {
		filename: '[name].js', // Dynamically generate output file names
		path: path.resolve( __dirname, 'assets/dist' ),
	},
};
