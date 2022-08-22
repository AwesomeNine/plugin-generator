/**
 * External dependencies
 */
const fs = require( 'fs-extra' )
const series = require( 'async/series' )
const eachSeries = require( 'async/eachSeries' )
const Handlebars = require( 'handlebars' )

/**
 * Internal dependencies
 */
const { getCurrentFolder } = require( './helpers' )

class CreatePlugin {
    run( settings, callback ) {
        this.settings = settings
        this.folder = getCurrentFolder()
        this.template = require.resolve( '../template' ).replace( '/index.js', '' )

        series(
            [
                this.directories,
                this.copyIndex,
                this.copyConfigs,
                this.prepareConfigs,
                this.prepareFiles,
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
            this.folder + '/templates',

            // Assets
            this.folder + '/assets/css',
            this.folder + '/assets/scss',
            this.folder + '/assets/js',
            this.folder + '/assets/src',
            this.folder + '/assets/img',
            this.folder + '/assets/acf',

            // Includes
            this.folder + '/includes',
            this.folder + '/includes/admin',
            this.folder + '/includes/interfaces',
        ]

        eachSeries( this.dirs, ( dir, nextDir ) => {
            fs.ensureDir( dir ).then( nextDir )
        }, () => {
            next()
        } )
    }

    copyIndex = ( next ) => {
        console.log( 'Copying golden silence!!' )
        const indexFile = this.template + '/index.php'

        eachSeries( this.dirs, ( dir, nextCopy ) => {
            fs.copy( indexFile, dir + '/index.php' ).then( nextCopy )
        }, () => {
            next()
        } )
    }

    copyConfigs = ( next ) => {
        console.log( 'Copying configuration files!!' )
        const configs = this.template + '/configs'
        fs.copy( configs, this.folder ).then( next )
    }

    prepareConfigs = ( next ) => {
        console.log( 'Preparing configuration files!!' )
        const configs =[
            this.folder + '/.phpcs.xml.dist',
            this.folder + '/composer.json',
            this.folder + '/package.json',
            this.folder + '/webpack.mix.js',
        ]

        eachSeries( configs, ( file, nextConfig ) => {
            this.renderFile( file, file, nextConfig )
        }, () => {
            next()
        } )
    }

    prepareFiles = ( next ) => {
        console.log( 'Preparing plugin files!!' )
        const template = this.template + '/plugin'
        const files =[
            '/uninstall.php',
            '/plugin.php',
            '/includes/class-plugin.php',
            '/includes/class-assets.php',
            '/includes/interfaces/interface-integration.php',
        ]

        eachSeries( files, ( file, nextFile ) => {
            this.renderFile( template + file, this.folder + file, nextFile )
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

module.exports = ( settings, next ) => {
    const generator = new CreatePlugin()
    generator.run( settings, next )
}
