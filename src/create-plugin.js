/**
 * External dependencies
 */
import fs from 'fs-extra'
import chalk from 'chalk'
import Handlebars from 'handlebars'
import { series, eachSeries } from 'async'

/**
 * Internal dependencies
 */
import { getCurrentFolder, runCommand, getTemplateFolder, heading } from './helpers.js'

class CreatePlugin {
    run( settings, callback ) {
        this.settings = settings
        this.folder = getCurrentFolder()
        this.template = getTemplateFolder()

        series(
            [
                this.directories,
                this.copyIndex,
                this.copyConfigs,
                this.prepareConfigs,
                this.prepareFiles,
                (next) => {
                    heading( 'Installing Composer' )
                    runCommand( 'composer', [ 'dump' ], next )
                },
                (next) => {
                    if ( 0 === this.settings.awesomePackages.length ) {
                        next()
                    }

                    heading( 'Installing selected PHP Packages' )
                    eachSeries( this.settings.awesomePackages, ( name, nextPkg ) => {
                        let pkg = name.split( ': ' )
                        pkg = 'awesome9/' + pkg[0].toLowerCase()
                        console.log( chalk.red( 'Installing ' + name ) )
                        runCommand( 'composer', [ 'require', pkg ], nextPkg )
                    }, () => {
                        next()
                    } )
                },
                (next) => {
                    heading( 'Installing Webpack' )
                    runCommand( 'pnpm', [ 'i -D webpack' ], next )
                },
                (next) => {
                    heading( 'Installing Tailwind CSS' )
                    runCommand( 'pnpm', [ 'i -D tailwindcss' ], next )
                },
                (next) => {
                    heading( 'Installing Postcss' )
                    runCommand( 'pnpm', [ 'i -D postcss' ], next )
                },
                (next) => {
                    heading( 'Installing Autoprefixer' )
                    runCommand( 'pnpm', [ 'i -D autoprefixer' ], next )
                },
                (next) => {
                    heading( 'Installing Laravel Mix' )
                    runCommand( 'pnpm', [ 'i -D laravel-mix' ], next )
                },
                (next) => {
                    heading( 'Installing Laravel Mix Tailwind extension' )
                    runCommand( 'pnpm', [ 'i -D laravel-mix-tailwind' ], next )
                },
            ],
            ( err, results ) => {
                callback()
            }
        )
    }

    directories = ( next ) => {
        heading( 'Creating directories!!' )
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
        heading( 'Copying golden silence!!' )
        const indexFile = this.template + '/index.php'

        eachSeries( this.dirs, ( dir, nextCopy ) => {
            fs.copy( indexFile, dir + '/index.php' ).then( nextCopy )
        }, () => {
            next()
        } )
    }

    copyConfigs = ( next ) => {
        heading( 'Copying configuration files!!' )
        series(
            [
                (callback) => {
                    fs.copy(
                        this.template + '/configs',
                        this.folder
                    ).then( callback )
                },
                (callback) => {
                    fs.copy(
                        this.template + '/assets/app.js',
                        this.folder + '/assets/src/app.js'
                    ).then( callback )
                },
                (callback) => {
                    fs.copy(
                        this.template + '/assets/app.scss',
                        this.folder + '/assets/scss/app.scss'
                    ).then( callback )
                },
            ],
            ( err, results ) => {
                next()
            }
        )
    }

    prepareConfigs = ( next ) => {
        heading( 'Preparing configuration files!!' )
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
        heading( 'Preparing plugin files!!' )
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

export default ( settings, next ) => {
    const generator = new CreatePlugin()
    generator.run( settings, next )
}
