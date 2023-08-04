/**
 * External dependencies
 */
import fs from 'fs-extra'
import chalk from 'chalk'
import Handlebars from 'handlebars'
import { series, eachSeries, waterfall } from 'async'

export const pluginData = {}

/**
 * Internal dependencies
 */
import { getCurrentFolder, runCommand, getTemplateFolder, heading, write, msgSuccessOnSameLine, execCommand } from '../../utilities/index.js'

/**
 * Helper functions
 */
function prepareFile( src, dest, next ) {
	const content = fs.readFileSync( src, 'utf8' )
	const template = Handlebars.compile( content )
	const rendered = template( pluginData.settings )

	fs.outputFile( dest, rendered ).then( next )
}

/**
 * Flow functions
 */
function setPluginData(next) {
	// pluginData.settings = {
	// 	company: {
	// 		name: 'WordPress Linear',
	// 		url: 'https://wplinear.com'
	// 	},
	// 	author: {
	// 		name: 'Shakeeb Ahmed',
	// 		email: 'me@shakeebahmed.com',
	// 		url: 'https://shakeebahmed.com'
	// 	},
	// 	wp: {
	// 		textDomain: 'wp-linear',
	// 		version: '1.0.0',
	// 		name: 'WordPress Linear',
	// 		description: 'WordPress agile project management',
	// 		proxy: 'http://wp-linear.vm'
	// 	},
	// 	php: { package: 'Linear' },
	// 	awesomePackages: [
	// 		'awesome9/database',
	// 		'awesome9/json'
	// 	],
	// 	year: 2023,
	// 	package: { vendor: 'word-press-linear', name: 'word-press-linear' },
	// 	functionName: 'linear'
	// }

	pluginData.folder = getCurrentFolder()
	pluginData.template = getTemplateFolder()

	pluginData.dirs = [
		// Root
		pluginData.folder,
		pluginData.folder + '/languages',
		pluginData.folder + '/templates',

		// Assets
		pluginData.folder + '/assets/css',
		pluginData.folder + '/assets/scss',
		pluginData.folder + '/assets/js',
		pluginData.folder + '/assets/src',
		pluginData.folder + '/assets/img',
		pluginData.folder + '/assets/acf',

		// Includes
		pluginData.folder + '/includes',
		pluginData.folder + '/includes/abstracts',
		pluginData.folder + '/includes/admin',
		pluginData.folder + '/includes/database',
		pluginData.folder + '/includes/interfaces',
		pluginData.folder + '/includes/models',
		pluginData.folder + '/includes/traits',
		pluginData.folder + '/includes/utilities',
	]

	next()
}

function createDirectories(next) {
	const indexFile = pluginData.template + '/index.php'

	write('Creating directory required for the plugin...')

	eachSeries( pluginData.dirs, ( dir, nextDir ) => {
		fs.ensureDir( dir ).then(() => {
			fs.copy( indexFile, dir + '/index.php' ).then( nextDir )
		})
	}, () => {
		msgSuccessOnSameLine(`${pluginData.dirs.length} directories created`)
		next()
	} )
}

function copyToolFiles(next) {
	write('Copying tools files...')
	fs.copySync(
		pluginData.template + '/tools',
		pluginData.folder + '/tools',
	)

	msgSuccessOnSameLine('Tool files copied')
	next()
}

function prepareConfigFiles(next) {
	const template = pluginData.template + '/configs'
	const files =[
		'/.editorconfig',
		'/.eslintignore',
		'/.eslintrc.js',
		'/.gitattributes',
		'/.gitignore',
		'/.phpcs.xml.dist',
		'/.prettierignore',
		'/.prettierrc.js',
		'/.stylelintrc',
		'/composer.json',
		'/package.json',
		'/phpunit.xml.dist',
		'/tailwind.config.js',
		'/webpack.mix.js',
	]

	write('Preparing configuration files...')

	eachSeries( files, ( file, nextConfig ) => {
		prepareFile( template + file, pluginData.folder + file, nextConfig )
	}, () => {
		msgSuccessOnSameLine(`${files.length} Configuration files prepared`)
		next()
	} )
}

function preparePluginFiles(next) {
	const template = pluginData.template + '/plugin'
	const files =[
		'/uninstall.php',
		'/plugin.php',
		'/includes/class-plugin.php',
		'/includes/class-assets.php',
		'/includes/interfaces/interface-integration.php',
		'/assets/src/app.js',
		'/assets/scss/app.scss',
	]

	write('Preparing plugin files...')

	eachSeries( files, ( file, nextFile ) => {
		prepareFile( template + file, pluginData.folder + file, nextFile )
	}, () => {
		msgSuccessOnSameLine(`${files.length} plugin files created with settings`)
		next()
	} )
}

function prepareGitRepository(next) {
	write( 'Checking GIT repo' )
	execCommand('git rev-parse --is-inside-work-tree && echo "OK" || git init', function() {
		msgSuccessOnSameLine('Git repository initiated successfully')
		next()
	})
}

function installComposer(next) {
	heading('Composer')
	write('Installing Composer...')
	execCommand('composer install -q', function() {
		msgSuccessOnSameLine('Composer installed successfully')
		next()
	})
}

function installComposerPackages(next) {
	if ( 0 === pluginData.settings.awesomePackages.length ) {
		next()
		return
	}

	eachSeries( pluginData.settings.awesomePackages, ( name, nextPackage ) => {
		write( chalk.red( 'Installing ' + name ) )
		execCommand(`composer require ${name} -q`, function() {
			msgSuccessOnSameLine(`Package: ${name} installed successfully`)
			nextPackage()
		})
	}, () => {
		next()
	} )
}

function installNodePackages(next) {
	const packages =[
		'@wordpress/eslint-plugin',
		'@wordpress/stylelint-config',
		'async',
		'browser-sync',
		'browser-sync-webpack-plugin',
		'chalk@4.1.2',
		'eslint-plugin-prettier',
		'husky',
		'laravel-mix',
		'laravel-mix-tailwind',
		'lint-staged',
		'prettier',
		'resolve-url-loader',
		'sass',
		'sass-loader',
		'shelljs',
		'tailwindcss',
		'webpack',
	]

	heading( 'Node Packages' )

	eachSeries( packages, ( pkg, nextPackage ) => {
		write( chalk.red( 'Installing ' + pkg ) )
		execCommand(`npm install -D ${pkg}`, function() {
			msgSuccessOnSameLine(`Package: ${pkg} installed successfully`)
			nextPackage()
		})
	}, () => {
		next()
	} )
}

function prepareNodePackages(next) {
	write( 'Adding Pre-Commit' )

	execCommand('npm run prepare', function() {
		execCommand('npx husky add .husky/pre-commit "npx lint-staged"', function() {
			msgSuccessOnSameLine('Pre-Commit hooks added successfully')
			next()
		})
	})
}

export default ( settings, next ) => {
	pluginData.settings = settings

	console.log('');
	heading('Scaffoling plugin...')

	waterfall(
		[
			setPluginData,
			createDirectories,
			copyToolFiles,
			prepareConfigFiles,
			preparePluginFiles,
			prepareGitRepository,
			installComposer,
			installComposerPackages,
			installNodePackages,
			prepareNodePackages
		],
		(err) => {
			if (err) {
				return next(true)
			}

			next()
		}
	)
}
