module.exports = {
	root: true,
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	globals: {
		jQuery: true,
		ajaxurl: true,
	},
	rules: {
		'import/no-unresolved': 'off',
	},
};
