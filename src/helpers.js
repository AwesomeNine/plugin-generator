/**
 * External dependencies
 */
const argv = require( 'yargs-parser' )
const flatCache = require( 'flat-cache' )
const { spawn } = require('child_process')

/**
 * Node dependencies
 */
const { join, resolve } = require( 'path' )
const { existsSync, readdirSync } = require( 'node:fs' )

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
exports.getRootFolder = function() {
    const check = function( folder ) {
        let final = folder
        const isEmptyFolder = folderEmptiness(folder)

        if (isEmptyFolder) {
            return folder
        }

        const exists = existsSync( folder + '/a9wp-scaffolding' )
        if (exists) {
            return final
        }

        final = join(folder, '../')
        check(final)
        return final
    }
    return check(process.cwd())
}

exports.getCommand = function() {
    const args = getArguments()
    return {
        command: args._[0] || 'make:plugin',
        args: args._[1] || []
    }
}

exports.getCurrentFolder = function() {
    let folder = process.cwd()
    const args = getArguments()

    if ( undefined !== args.folder ) {
        folder = resolve( './' + args.folder )
    }

    return folder
}

exports.getSettings = function () {
    const cache = exports.getCacheStore()
    let saved = cache.all()
    saved = saved ? saved.answers : {}

    return saved
}

exports.getCacheStore = function() {
    return flatCache.load( 'a9wp-scaffolding', exports.getRootFolder() )
}

exports.runCommand = function( command, args, next ) {
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
