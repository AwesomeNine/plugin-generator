/**
 * Node dependencies
 */
import { exec, spawn } from 'node:child_process'

/**
 * Internal Dependencies
 */
import { onSameLine } from './formatting.js'

/**
 * Run a command in the terminal.
 *
 * @param {string} command Command to run
 * @param {string[]} args Arguments to pass
 * @param {Function} callback Callback function
 *
 * @returns {void}
 */
export function runCommand( command, args, callback ) {
    const commandSpawn = spawn( command, args, {
        shell: true,
        stdio: [ 'inherit' ]
    } )

    commandSpawn.stdout.on( 'data', (data) => {
        onSameLine(data.toString())
    })

    commandSpawn.stderr.on( 'data', (data) => {
        onSameLine(data.toString().replace('\n','').replace('\r','').trim())
    })

    commandSpawn.on( 'close', (code) => {
        callback()
    })
}

/**
 * Execute a command in the terminal.
 *
 * @param {string} command Command to execute
 * @param {Function} callback Callback function
 *
 * @returns {void}
 */
export function execCommand( command, callback ) {
	if ('string' !== typeof command) {
		command = command.join(' ')
	}

    exec( command, (error, stdout, stderr) => callback(stdout, error, stderr) )
}
