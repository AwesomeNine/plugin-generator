/**
 * External dependencies
 */
const argv = require( 'yargs-parser' )
const flatCache = require( 'flat-cache' )

/**
 * Node dependencies
 */
const { resolve } = require( 'path' )

exports.getCurrentFolder = function() {

    let folder = process.cwd()
    const args = argv( process.argv.slice( 2 ) )

    if ( undefined !== args.folder ) {
        folder = resolve( './' + args.folder )
    }

    return folder
}

exports.getCacheStore = function() {
    return flatCache.load( 'a9wp-scaffolding', exports.getCurrentFolder() )
}
