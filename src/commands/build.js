/**
 * External Dependencies
 */
import fs from 'fs';
import chalk from 'chalk'
import { waterfall } from 'async'
import logSymbols from 'log-symbols'

/**
 * Node dependencies
 */
import { pluginData } from './release.js';
import wpPot from './wp-pot.js';
import { heading, onSameLine, execCommand } from '../utilities/index.js'

export default function wpBuild(nextProcess = null) {
	heading('Building the plugin...')
	console.log('------------------------------------------------');

	waterfall(
        [
            (next) => {
				process.stdout.write('Clearing packages folder...')
				try {
					fs.rmSync( 'packages', { recursive: true, force: true } );
					onSameLine(`${logSymbols.success} Cleared packages folder`)
				} catch ( _ ) {}
				next();
			},
            (next) => {
				process.stdout.write('Installing PHP dependencies...')

				execCommand(
					'composer install -o -a -n --no-dev --no-scripts',
					function() {
						onSameLine(`${logSymbols.success} Installed PHP dependencies`);
						process.stderr.write('Composer dumping....')

						execCommand('composer dump', function() {
							onSameLine(`${logSymbols.success} Composer updated`)
							pluginData.commitMessages.push('update 3rd party dependecies')
							next();
						})
					},
					{
						env: { ...process.env, COMPOSER_VENDOR_DIR: 'packages' },
					}
				);

			},
            (next) => {
				process.stdout.write('Building plugin resources...')
				execCommand( 'npx wp-scripts build', function() {
					onSameLine(`${logSymbols.success} Built plugin resources`);
					pluginData.commitMessages.push('Build plugin resources')
					next();
				});
			},
            (next) => {
				console.log('')
				wpPot(next);
			},
        ],
        ( err, results ) => {
            if (err) {
                console.log('');
                console.log( `${logSymbols.error} ${chalk.bold.red(`We failed somewhere! Work hard mate...`)}` )
				if (typeof nextProcess === 'function') {
					nextProcess(true);
				}
                return
            }

			if (typeof nextProcess === 'function') {
				nextProcess();
			} else {
				console.log('');
				console.log( `${logSymbols.success} ${chalk.bold.green(`All done!`)}` )
			}
        }
    );
}
