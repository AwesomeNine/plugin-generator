/**
 * External Dependencies
 */
import argv from 'yargs-parser'

/**
 * Get arguments
 *
 * @returns {Array} arguments
 */
export function getArguments() {
    return argv( process.argv.slice( 2 ) )
}

/**
 * Get command with arguments
 *
 * @returns {Object} command and arguments
 */
export function getCommand() {
    const args = getArguments()
    const { _, ...rest } = args
    const command = _[0] || 'help'

    return {
        command,
        args: rest || []
    }
}
