/**
 * Node dependencies
 */
import { exec, spawn } from 'node:child_process'

/**
 * Internal Dependencies
 */
import { onSameLine } from './formatting.js'

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

export function execCommand( command, callback ) {
	if ('string' !== typeof command) {
		command = command.join(' ')
	}

    exec( command, (error, stdout, stderr) => callback(stdout, error, stderr) )
}
