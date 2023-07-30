/**
 * External Dependencies
 */
import chalk from 'chalk'
import { waterfall } from 'async'
import logSymbols from 'log-symbols'

/**
 * Internal Dependencies
 */
import { heading } from "../../helpers.js"
import prompts from './prompts.js'
import createPlugin from './create-plugin.js'

export function execute() {
    heading('Scaffoling plugin...')
    console.log('');

    waterfall(
        [
           prompts,
           createPlugin,
        ],
        ( err, results ) => {
            console.log( `${logSymbols.success} ${chalk.bold.green(`All done!`)}` )
        }
    )
}
