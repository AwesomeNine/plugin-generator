/**
 * External Dependencies
 */
import chalk from 'chalk'
import fs from 'fs-extra'
import { eachSeries, waterfall } from 'async'

/**
 * Node Dependencies
 */
import path from 'path';

/**
 * Internal Dependencies
 */
import { getSetting, execCommand, heading, msgErrorTitle, getTemplateFile, compileTemplate, write, msgSuccessOnSameLine, getTemplateFolder } from "../utilities/index.js";

export const pluginData = {}

function prepareFile( src, dest, next ) {
	const content = compileTemplate(src, pluginData.settings);
	fs.writeFileSync(dest, content);
	next();
}

function setPluginData(next) {
	pluginData.folder = process.cwd()
	pluginData.settings = getSetting()
	pluginData.template = getTemplateFolder()
	pluginData.includeFolder = path.join(pluginData.folder, pluginData.settings.paths.php)

	pluginData.dirs = [
		// Root
		pluginData.folder + '/languages',
		path.join(pluginData.folder, pluginData.settings.paths.views),
		path.join(pluginData.folder, pluginData.settings.paths.updates),

		// Assets
		path.join(pluginData.folder, 'assets'),
		path.join(pluginData.folder, 'assets/css'),
		path.join(pluginData.folder, 'assets/js'),
		path.join(pluginData.folder, 'assets/images'),
		path.join(pluginData.folder, pluginData.settings.paths.scss),
		path.join(pluginData.folder, pluginData.settings.paths.javascript),

		// Includes
		pluginData.includeFolder,
		path.join(pluginData.includeFolder, 'abstracts'),
		path.join(pluginData.includeFolder, 'admin'),
		path.join(pluginData.includeFolder, 'admin/pages'),
		path.join(pluginData.includeFolder, 'frontend'),
		path.join(pluginData.includeFolder, 'installation'),
		path.join(pluginData.includeFolder, 'traits'),
		path.join(pluginData.includeFolder, 'utilities'),
	]

	next()
}

function createDirectories(next) {
	const indexFile = getTemplateFile('files/silence.php')

	write('Creating directories required for the plugin...')

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
	prepareFile( `${pluginData.template}/tools/laravel-mix/wp-pot.js`, `${pluginData.folder}/tools/laravel-mix/wp-pot.js`, () => {} )

	msgSuccessOnSameLine('3 tools created')
	next()
}

function prepareConfigFiles(next) {
	const template = pluginData.template + '/configs'
	const files =[
		'/.editorconfig',
		'/.eslintignore',
		'/.gitattributes',
		'/.gitignore',
		'/.phpcs.xml.dist',
		'/.prettierignore',
		'/.stylelintrc',
		'/composer.json',
		'/package.json',
		'/postcss.config.js',
		'/tailwind.config.js',
		'/webpack.config.js',
	]

	write('Preparing configuration files...')

	eachSeries( files, ( file, nextConfig ) => {
		let dest = file
		if ( '/gitattributes' === file ) {
			dest = '/.gitattributes'
		}

		if ( '/gitignore' === file ) {
			dest = '/.gitignore'
		}

		prepareFile( template + file, pluginData.folder + dest, nextConfig )
	}, () => {
		msgSuccessOnSameLine(`${files.length} Configuration files prepared`)
		next()
	} )
}

function preparePluginFiles(next) {
	const template = pluginData.template + '/plugin'
	const files =[
		'/src/scss/ui-toolkit.scss',
		'/src/ui-toolkit.js',
		'/includes/admin/class-admin.php',
		'/includes/admin/class-screens.php',
		'/includes/admin/pages/class-dashboard.php',
		'/includes/admin/pages/class-settings.php',
		'/includes/frontend/class-frontend.php',
		'/includes/installation/class-install.php',
		'/includes/installation/class-uninstall.php',
		'/includes/class-assets-registry.php',
		'/includes/class-autoloader.php',
		'/includes/class-constants.php',
		'/includes/class-entities.php',
		'/includes/class-plugin.php',
		'/includes/class-upgrades.php',
		'/functions.php',
		'/plugin.php',
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
		'@wordpress/scripts',
		'async',
		'husky',
		'lint-staged',
		'shelljs',
		'tailwindcss',
		'webpack-cli',
		'browser-sync-webpack-plugin --force',
	]

	heading( 'Node Packages' )

	eachSeries( packages, ( pkg, nextPackage ) => {
		write( chalk.yellow( 'Installing ' + pkg ) )
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

export default () => {
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
				msgErrorTitle('We failed!!!');
			}
		}
	)
}
