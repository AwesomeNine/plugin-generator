/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./{{paths.javascript}}/**/*.js",
    "./{{paths.php}}/**/*.php",
	"./{{paths.views}}/**/*.php",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
