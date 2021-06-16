/**
 * External dependencies
 */
const fs = require( 'fs-extra' )
const series = require( 'async/series' )
const eachSeries = require( 'async/eachSeries' )
const Handlebars = require( 'handlebars' )

/**
 * Node dependencies
 */
const { parse, resolve } = require( 'path' )

class CreatePlugin {
    run( answers, callback ) {
        this.answers = answers
        this.folder = resolve( './plugin' )

        series(
            [
                this.directories,
                this.copyIndex,
                this.copyConfigs,
                this.prepareConfigs,
                this.copyFiles,
            ],
            ( err, results ) => {
                callback()
            }
        )
    }

    directories = ( next ) => {
        console.log( 'Creating directories needed!!' )
        this.dirs = [
            this.folder,
            this.folder + '/includes',
            this.folder + '/assets/css',
            this.folder + '/assets/scss',
            this.folder + '/assets/js',
            this.folder + '/assets/src',
            this.folder + '/assets/img',
            this.folder + '/assets/acf',
        ]

        eachSeries( this.dirs, ( dir, nextDir ) => {
            console.log( dir )
            fs.ensureDir( dir ).then( nextDir )
        }, () => {
            next()
        } )
    }

    copyIndex = ( next ) => {
        console.log( 'Copying golden silence!!' )
        const indexFile = resolve( './template/index.php' )

        eachSeries( this.dirs, ( dir, nextCopy ) => {
            fs.copy( indexFile, dir + '/index.php' ).then( nextCopy )
        }, () => {
            next()
        } )
    }

    copyConfigs = ( next ) => {
        console.log( 'Copying configuration files!!' )
        const configs = resolve( './template/configs' )
        fs.copy( configs, this.folder ).then( next )
    }

    prepareConfigs = ( next ) => {
        console.log( 'Preparing configuration files!!' )
        const configs =[
            this.folder + '/.phpcs.xml.dist',
            this.folder + '/composer.json',
            this.folder + '/package.json',
        ]

        eachSeries( configs, ( file, nextCopy ) => {
            const content = fs.readFileSync( file, 'utf8' )
            const template = Handlebars.compile( content )
            const rendered = template( this.answers )

            fs.outputFile( file, rendered ).then( nextCopy )
        }, () => {
            next()
        } )
    }

    copyFiles = ( next ) => {
        console.log( 'copyFiles' )
        next()
    }
}

module.exports = ( answers, next ) => {
    const generator = new CreatePlugin()
    generator.run( answers, next )
}
