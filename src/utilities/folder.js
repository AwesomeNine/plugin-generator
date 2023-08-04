/**
 * Node dependencies
 */
import fs from 'fs'
import { join } from 'path'
import { createRequire } from 'node:module'

/**
 * Internal Dependencies
 */
import { CACHE_FILE } from './cache.js'
import { getArguments } from './command.js'

export function folderEmptiness(folder) {
    const folderFiles = fs.readdirSync(folder)
    if (1 === folderFiles.length || 0 === folderFiles.length) {
        return true
    }

    return false
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
    return require.resolve( '../../template' )
        .replace( '/index.js', '' )
}
