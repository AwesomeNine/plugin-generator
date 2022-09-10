/**
 * External dependencies
 */
import argv from 'yargs-parser'
import flatCache from 'flat-cache'
import { spawn } from 'child_process'
import { createRequire } from 'node:module'

/**
 * Node dependencies
 */
import { join, resolve } from 'path'
import { existsSync, readdirSync } from 'node:fs'

const getArguments = function() {
    return argv( process.argv.slice( 2 ) )
}

const folderEmptiness = function( folder ) {
    const folderFiles = readdirSync( folder )
    if (1 === folderFiles.length || 0 === folderFiles.length) {
        return true
    }

    return false
}

export function getTemplateFolder() {
    const require = createRequire( import.meta.url )
    return require.resolve( '../template' )
        .replace( '/index.js', '' )
}

export function getRootFolder() {
    let counter = 0
    const check = function( folder ) {
        const isEmptyFolder = folderEmptiness(folder)

        if (isEmptyFolder) {
            return folder
        }

        const existsConfig = existsSync( folder + '/a9wp-scaffolding' )
        const existsPkg = existsSync( folder + '/package.json' )
        if (existsConfig || existsPkg) {
            return folder
        }

        if ( 5 === counter ) {
            return process.cwd()
        }

        counter++
        return check(join(folder, '../'))
    }

    return check(process.cwd())
}

export function getCommand() {
    const args = getArguments()
    return {
        command: args._[0] || 'make:plugin',
        args: args._[1] || []
    }
}

export function getCurrentFolder() {
    let folder = process.cwd()
    const args = getArguments()

    if ( undefined !== args.folder ) {
        folder = resolve( './' + args.folder )
    }

    return folder
}

export function getSettings() {
    const cache = getCacheStore()
    let saved = cache.all()
    saved = saved ? saved.answers : {}

    return saved
}

export function getCacheStore() {
    return flatCache.load( 'a9wp-scaffolding', getRootFolder() )
}

export function runCommand( command, args, next ) {
    const commandSpawn = spawn( command, args, {
        shell: true,
        stdio: [ 'inherit' ]
    } )

    commandSpawn.stdout.on( 'data', (data) => {
        console.log(data.toString())
    })

    commandSpawn.stderr.on( 'data', (data) => {
        console.error(`Error: ${data}`)
    })

    commandSpawn.on( 'close', (code) => {
        next()
    })
}
