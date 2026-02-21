/**
 * External Dependencies
 */
import chalk from 'chalk'
import { eachSeries } from 'async'
import logSymbols from 'log-symbols'

/**
 * Internal Dependencies
 */
import { execCommand, write, onSameLine, heading } from "../../utilities/index.js"

export function initNpm(next) {
	const packages =[
		'@wordpress/scripts',
		'async',
		'husky',
		'lint-staged',
		'postcss',
		'@tailwindcss/postcss',
	]

	console.log('');
	heading('Initializing Node packages...')
	console.log('------------------------------------------------');

	eachSeries( packages, ( pkg, nextPackage ) => {
		write( chalk.yellow( 'Installing ' + pkg ) )
		execCommand(`npm install -D ${pkg}`, function() {
			onSameLine(`${logSymbols.success} ${pkg} installed successfully`)
			nextPackage()
		})
	}, () => {
		next()
	} )
}

export function initHusky(next) {
	write( 'Preparing husky and lint-staged...' )

	execCommand('npm run prepare', function() {
		execCommand('npx husky add .husky/pre-commit "npx lint-staged"', function() {
			onSameLine(`${logSymbols.success} Pre-Commit hooks added successfully`)
			next()
		})
	})
}
