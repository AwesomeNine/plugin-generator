/**
 * Node dependencies
 */
import { exec, spawn } from 'node:child_process'

export function runCommand( command, args, next ) {
    const commandSpawn = spawn( command, args, {
        shell: true,
        stdio: [ 'inherit' ]
    } )

    commandSpawn.stdout.on( 'data', (data) => {
        console.log(data.toString())
    })

    commandSpawn.stderr.on( 'data', (data) => {
        console.error(data.toString())
    })

    commandSpawn.on( 'close', (code) => {
        next()
    })
}

export function execCommand( command, callback ) {
	if ('String' !== typeof command) {
		command = command.join(' ')
	}

    exec( command, (error, stdout, stderr) => callback(stdout, error, stderr) )
}
