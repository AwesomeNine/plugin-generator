/**
 * External dependencies
 */
import chalk from 'chalk'
import argv from 'yargs-parser'
import logSymbols from 'log-symbols'
import flatCache from 'flat-cache'
import { spawn } from 'node:child_process'

/**
 * Node dependencies
 */
import fs from 'fs'
import { join } from 'path'
import { createRequire } from 'node:module'

const CACHE_FILE = 'adv-ads-scaffolding'

const getArguments = function() {
    return argv( process.argv.slice( 2 ) )
}

const folderEmptiness = function( folder ) {
    const folderFiles = fs.readdirSync( folder )
    if (1 === folderFiles.length || 0 === folderFiles.length) {
        return true
    }

    return false
}

export function heading(title) {
    console.log('')
    console.log( chalk.bold.green( 'Ⓞ  ' + title ) )
}

export function onNewLine(text) {
    console.log('')
    console.log(text)
}

export function getCommand() {
    const args = getArguments()
    const { _, ...rest } = args
    const command = _[0] || 'help'

    return {
        command,
        args: rest || []
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

export function getRootFolder() {
    let counter = 0
    const check = function( folder ) {
        const isEmptyFolder = folderEmptiness(folder)

        if (isEmptyFolder) {
            return folder
        }

        const existsConfig = fs.existsSync( folder + '/' + CACHE_FILE )
        const existsPkg = fs.existsSync( folder + '/package.json' )
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

export function getTemplateFolder() {
    const require = createRequire( import.meta.url )
    return require.resolve( '../template' )
        .replace( '/index.js', '' )
}

export function getCacheStore() {
    return flatCache.load( CACHE_FILE, getRootFolder() )
}

export function getSettings() {
    const cache = getCacheStore()
    let saved = cache.all()
    saved = saved ? saved.answers : {}

    return saved
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
        console.error(data.toString())
    })

    commandSpawn.on( 'close', (code) => {
        next()
    })
}
