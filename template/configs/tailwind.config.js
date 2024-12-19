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
				primary: 'rgb(var(--awesome-color-primary))',
				'primary-hover': 'rgb(var(--awesome-color-primary-hover))',
			},
			borderColor: {
				primary: 'rgb(var(--awesome-border-color))',
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
