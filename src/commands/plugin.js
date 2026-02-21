/**
 * External Dependencies
 */
import chalk from 'chalk'
import { waterfall } from 'async'
import logSymbols from 'log-symbols'

/**
 * Node dependencies
 */
import { heading } from '../utilities/index.js'

/**
 * Internal Dependencies
 */
import { init } from './plugin/init.js'
import { createDirectories } from './plugin/create-directories.js'
import { createConfigs, createPluginFiles } from './plugin/create-files.js'
import { initGitRepository } from './release/git.js'
import { initComposer } from './plugin/composer.js'
import { initNpm, initHusky } from './plugin/npm.js'

export const pluginData = {}

export default () => {
	heading('Creating files for plugin...')
	console.log('------------------------------------------------');

	waterfall(
		[
			init,
			createDirectories,
			createConfigs,
			createPluginFiles,
			initGitRepository,
			initComposer,
			initNpm,
			initHusky,
		],
		( err, results ) => {
            if (err) {
                console.log('');
                console.log( `${logSymbols.error} ${chalk.bold.red(`We failed somewhere! Work hard mate...`)}` )
                return
            }

            console.log('');
            console.log( `${logSymbols.success} ${chalk.bold.green(`All done!`)}` )
        }
	)
}
