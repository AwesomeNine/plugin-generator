/**
 * External Dependencies
 */
import logSymbols from 'log-symbols'

/**
 * Internal Dependencies
 */
import { execCommand, write, onSameLine } from "../../utilities/index.js"

export function initComposer(next) {
	write('Initializing Composer...')
	execCommand('composer install -q', function() {
		onSameLine(`${logSymbols.success} Composer initialized`)
		next()
	})
}
