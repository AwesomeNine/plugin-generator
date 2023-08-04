/**
 * External Dependencies
 */
import { waterfall } from 'async'

/**
 * Internal Dependencies
 */
import prompts from './prompts.js'
import createPlugin from './create-plugin.js'
import { msgErrorTitle, msgSuccessTitle } from "../../utilities/index.js"

export function execute() {
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
