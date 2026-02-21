#!/usr/bin/env node

/**
 * External dependencies
 */
import chalk from 'chalk'
import { program } from 'commander'

/**
 * Commands
 */
import * as commands from './commands/index.js'
import { configFileExists, onNewLine } from './utilities/index.js'

/**
 * App
 */
const app = async () => {
    console.log(
        [
            chalk.hex('#FADC00').inverse.bold('Awesome9 WordPress Plugin Toolkit'),
            chalk.white( 'v2.0.0' ),
            chalk.dim( 'by Shakeeb Ahmed' )
        ].join(" ")
    );

	program.configureHelp({
		sortSubcommands: true,
	});

	program
		.name('wp-awesome')
		.description('CLI to Awesome9 scaffolding utilities')
		.version('2.0.0')
		.hook('preAction', (thisCommand, actionCommand) => {
			if ( 'init' !== actionCommand.name() && ! configFileExists() ) {
				onNewLine(chalk.bgRed.white('Config file not found. Run `wp-awesome init` to create a new config file.'));
				process.exit(1);
			}
		})
		.showHelpAfterError();

	// Command: init
	program
		.command('init')
		.description('Create new config file for the project')
		.action(commands.init);

	// Command: build
	program
		.command('build')
		.description('Build the plugin/theme according to the config file')
		.action(commands.build);

	// Command: plugin
	// program
	// 	.command('plugin')
	// 	.description('Create a new plugin')
	// 	.action(commands.plugin);

	// Command: release
	program
		.command('release')
		.description('Create a new release for the plugin')
		.action(commands.release);

	program.command('create-plugin')
		.description('Create a new plugin')
		.action(commands.plugin);

	// Command: class
	program
		.command('class')
		.description('Create a new class file')
		.argument('<classname>', 'Classname')
		.option('-h <heading>', 'Heading of the file')
		.option('-d <description>', 'Description of the file')
		.option('-i', 'Initializer interface template')
		.option('-g', 'Integration interface template')
		.option('-r', 'Rest interface template')
		.option('-s', 'Singleton template')
		.action(commands.classFile);

	// Command: view
	program
		.command('view')
		.description('Create a new view')
		.argument('<viewname>', 'name of the view')
		.argument('[heading]', 'Heading of the file')
		.action(commands.views);

	// Command: updates
	program
		.command('updates')
		.description('Updates for the plugin')
		.argument('<version>', 'version number')
		.action(commands.updates);

	// Command: js
	program
		.command('js')
		.description('Create a new JavaScript file')
		.argument('<filename>', 'name of the file')
		.option('-h <heading>', 'Heading of the file')
		.option('-d <description>', 'Description of the file')
		.action(commands.javascript);

	// Command: css
	program
		.command('css')
		.description('Create a new CSS file')
		.argument('<filename>', 'name of the file')
		.option('-h <heading>', 'Heading of the file')
		.option('-d <description>', 'Description of the file')
		.action(commands.css);

	// Command: wp-pot
	program
		.command('pot')
		.description('Create po and mo files')
		.action(commands.wpPot);

	// Command: wp-glotpress
	program
		.command('translations')
		.description('Download translations from GlotPress')
		.action(commands.wpGlotpress);

	// Lets begin
	program.parse(process.argv)
}

app()
