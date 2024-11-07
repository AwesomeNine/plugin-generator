/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./{{paths.javascript}}/**/*.js",
		"./{{paths.php}}/**/*.php",
		"./{{paths.views}}/**/*.php",
		"./vendor/awesome9/framework/views/**/*.php",
	],
	theme: {
		extend: {
			colors: {
				brand: '#0074a2',
				wordpress: '#2271b1',
				'wordpress-dark': '#135e96',
				secondary: '#b4cae0',
			},
			backgroundColor: {
				primary: '#f8f9fa',
			},
			borderColor: {
				primary: '#b5bfc9',
			},
		},
	},
	plugins: [],
	safelist: [
		'w-6',
		'h-6',
		'inline-block',
		'fill-current',
		'stroke-current',
		'text-current',
		'text-white',
		'sr-only',
	],
}
