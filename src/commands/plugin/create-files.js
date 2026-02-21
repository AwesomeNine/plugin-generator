import fs from 'fs-extra'
import { eachSeries } from 'async'

import { pluginData } from '../plugin.js'
import { compileTemplate } from '../../utilities/filesystem.js'
import { write } from '../../utilities/formatting.js'
import { msgSuccessOnSameLine } from '../../utilities/formatting.js'

function prepareFile( src, dest, next ) {
	const content = compileTemplate(src, pluginData.settings);
	fs.writeFileSync(dest, content);
	next();
}

export function createConfigs(next) {
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
		'/dev.config.example.json',
		'/phpmd.xml',
		'/phpunit.xml.dist',
		'/playwright.config.ts',
		'/postcss.config.js',
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

export function createPluginFiles(next) {
	const template = pluginData.template + '/plugin'
	const files =[
		'/includes/installation/class-install.php',
		'/includes/installation/class-uninstall.php',
		'/includes/class-assets-registry.php',
		'/includes/class-autoloader.php',
		'/includes/class-constants.php',
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
