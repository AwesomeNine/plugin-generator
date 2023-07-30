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
import createFile from './create-file.js'

export function execute(args) {
    heading('Scaffoling plugin...')
    console.log('');

    waterfall(
        [
            function( next ) {
                next(null, args)
            },
            createFile,
        ],
        ( err, results ) => {
            console.log( `${logSymbols.success} ${chalk.bold.green(`All done!`)}` )
        }
    )
}
