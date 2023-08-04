/**
 * External Dependencies
 */
import { waterfall } from 'async'

/**
 * Internal Dependencies
 */
import prompts from './prompts.js'
import createPlugin from './create-plugin.js'
import { heading, msgErrorTitle, msgSuccessTitle } from "../../utilities/index.js"

export function execute() {
    heading('Scaffoling plugin...')
    console.log('');

    waterfall(
        [
           prompts,
           createPlugin,
        ],
        (err) => {
            console.log('');
			if (err) {
				msgErrorTitle('We failed!!!')
				return
			}

            msgSuccessTitle('All done!')
        }
    )
}
