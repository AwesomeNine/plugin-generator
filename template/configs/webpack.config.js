const path = require('path');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
});

// Remove plugins.
const pluginsToRemove = ['CleanWebpackPlugin', 'RtlCssPlugin'];
defaultConfig.plugins = defaultConfig.plugins.filter(
	(plugin) => !pluginsToRemove.includes(plugin.constructor.name)
);

// Replace the existing CleanWebpackPlugin with a customized version
defaultConfig.plugins.push( new CleanWebpackPlugin({
	cleanOnceBeforeBuildPatterns: ['!fonts/**', '!img/**', '!src/**', '!scss/**' ],
	cleanStaleWebpackAssets: false,
}));

module.exports = {
	...defaultConfig,
	entry: {
		'ui-toolkit': path.resolve(__dirname, 'assets/src/ui-toolkit.js'),
	},
	output: {
		filename: 'js/[name].js', // Dynamically generate output file names
		path: path.resolve(__dirname, 'assets'),
	},
};
