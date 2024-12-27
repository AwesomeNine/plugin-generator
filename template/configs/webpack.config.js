/**
 * External Dependencies
 */
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

// Add TailwindCSS to the SCSS rule
defaultConfig.module.rules.forEach((rule) => {
	if (rule.test && rule.test.toString() === /\.(sc|sa)ss$/.toString()) {
		rule.use = rule.use.map((loader) => {
			if (typeof loader === 'object' && loader.loader === 'postcss-loader') {
				loader.options = {
					...loader.options,
					postcssOptions: {
						...loader.options.postcssOptions,
						plugins: [
							...(loader.options.postcssOptions.plugins || []),
							require('tailwindcss'),
							require('autoprefixer'),
						],
					},
				};
			}
			return loader;
		});
	}
});

defaultConfig.plugins.forEach((plugin) => {
	if (plugin.constructor.name === 'MiniCssExtractPlugin') {
		plugin.options.filename = 'css/[name].css';
	}
	if (plugin.constructor.name === 'CleanWebpackPlugin') {
		plugin.cleanOnceBeforeBuildPatterns = [ '!fonts/**', '!images/**' ];
	}
});

// Remove plugins.
const pluginsToRemove = ['RtlCssPlugin'];
defaultConfig.plugins = defaultConfig.plugins.filter(
	(plugin) => !pluginsToRemove.includes(plugin.constructor.name)
);

if (!isProduction) {
	defaultConfig.plugins.push(new BrowserSyncPlugin({
		host: 'localhost',
		port: 3000,
		proxy: '{{misc.proxy}}',
		files: ['**/*.php'],
	}));
}

const basePath = path.resolve(__dirname, 'src');

module.exports = {
	...defaultConfig,
	entry: {
		'ui-toolkit': path.join(basePath, '/ui-toolkit.js'),
	},
	output: {
		filename: 'js/[name].js', // Dynamically generate output file names
		path: path.resolve(__dirname, 'assets'),
	},
};
