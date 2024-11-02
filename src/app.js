#!/usr/bin/env node

/**
 * External dependencies
 */
import chalk from 'chalk'
import { program } from 'commander'

/**
 * Commands
 */
import { getSetting, configFileExists } from './utilities/index.js'
import { init } from './commands/index.js'

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
		});

	program
		.command('init')
		.description('Create new config file')
		.action(init);


program.command('split')
  .description('Split a string into substrings and display as an array')
  .argument('<string>', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action((str, options) => {
	console.log('setting:', getSetting('company.name'));
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });
	program.parse(process.argv)
}

app()
