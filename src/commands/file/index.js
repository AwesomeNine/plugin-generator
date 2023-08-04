/**
 * External Dependencies
 */
import { waterfall } from 'async'

/**
 * Internal Dependencies
 */
import createFile from './create-file.js'
import { heading, msgErrorTitle, msgSuccessTitle } from "../../utilities/index.js"

export default function(args) {
    heading('Scaffoling plugin file')
    console.log('');

    waterfall(
        [
            function( next ) {
                next(null, args)
            },
            createFile,
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
