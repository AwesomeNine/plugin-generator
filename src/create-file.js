/**
 * External dependencies
 */
import fs from 'fs-extra'
import Handlebars from 'handlebars'
import { series, eachSeries } from 'async'

/**
 * Internal dependencies
 */
import { getSettings, getRootFolder, runCommand } from './helpers.js'

class CreateFile {
    run( controllerName, callback ) {
        const namespace = controllerName.split('\\')

        this.template = require.resolve( '../template' ).replace( '/index.js', '' )

        // Settings
        this.settings = getSettings()
        this.settings.namespace = ''
        this.settings.className = namespace.pop()
        this.settings.heading = controllerName
            .replace(/\\/g, ' ')
            .replace(/_/g, ' ')

        // Filename
        this.fileName = this.settings.className
            .toLowerCase()
            .replace(/_/g, '-')
        this.fileName = `class-${this.fileName}.php`

        // Folder
        this.folder = getRootFolder() + '/includes/'

        if (namespace.length > 0) {
            this.settings.namespace = '\\' + namespace.join('\\')
            this.folder = this.folder + namespace.join('/').toLowerCase() + '/'
        }

        series(
            [
                this.directories,
                this.prepareFiles,
                (next) => {
                    runCommand( 'composer', [ 'dump' ], next )
                },
            ],
            ( err, results ) => {
                callback()
            }
        )
    }

    directories = ( next ) => {
        console.log( 'Creating directories!!' )
        this.dirs = [
            // Root
            this.folder,
        ]

        eachSeries( this.dirs, ( dir, nextDir ) => {
            fs.ensureDir( dir ).then( nextDir )
        }, () => {
            next()
        } )
    }

    prepareFiles = ( next ) => {
        console.log( 'Preparing plugin files!!' )
        const template = this.template + '/make'
        const files =[ '/file.php' ]

        eachSeries( files, ( file, nextFile ) => {
            this.renderFile( template + file, this.folder + this.fileName, nextFile )
        }, () => {
            next()
        } )
    }

    renderFile = ( src, dest, next ) => {
        const content = fs.readFileSync( src, 'utf8' )
        const template = Handlebars.compile( content )
        const rendered = template( this.settings )

        fs.outputFile( dest, rendered ).then( next )
    }
}

export default ( fileName, next ) => {
    const generator = new CreateFile()
    generator.run( fileName, next )
}
