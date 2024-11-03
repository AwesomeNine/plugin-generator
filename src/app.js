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
import { configFileExists } from './utilities/index.js'

/**
 * App
 */
const app = async () => {
    console.log(
        [
            chalk.hex('#FADC00').inverse.bold('Awesome WordPress Plugin Scaffolding'),
            chalk.white( 'v2.0.0' ),
            chalk.dim( 'by Shakeeb Ahmed' )
        ].join(" ")
    );

	program
		.name('wp-awesome9')
		.description('CLI to some WordPress scaffolding utilities')
		.version('2.0.0')
		.hook('preAction', (thisCommand, actionCommand) => {
			if ( 'init' !== actionCommand.name() && ! configFileExists() ) {
				console.log(chalk.red('Config file not found. Run `wp-awesome9 init` to create a new config file.'));
			}
		})
		.showHelpAfterError();

	// Command: init
	program
		.command('init')
		.description('Create new config file for the project')
		.action(commands.init);

	// Command: version
	program
		.command('version')
		.description('Upadte the version of the plugin')
		.argument('<version>', 'Either a version number (e.g., 1.2.3) or type (major, minor, patch)')
		.action(commands.version);

	// Command: plugin - todo
	program
		.command('plugin')
		.description('Create a new plugin')
		.action(commands.plugin);

	// Command: class
	program
		.command('class')
		.description('Create a new class file')
		.argument('<classname>', 'Classname')
		.argument('[heading]', 'Heading of the file')
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
		.argument('[heading]', 'Heading of the file')
		.option('-w', 'Add to webpack mix file for processing')
		.action(commands.javascript);

	// Command: css
	program
		.command('css')
		.description('Create a new CSS file')
		.argument('<filename>', 'name of the file')
		.argument('[heading]', 'Heading of the file')
		.option('-w', 'Add to webpack mix file for processing')
		.action(commands.css);

	// Lets begin
	program.parse(process.argv)
}

app()
