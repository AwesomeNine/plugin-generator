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
import { getCurrentFolder, runCommand, getTemplateFolder, heading } from '../../helpers.js'

class CreatePlugin {
    run( settings, callback ) {
        this.settings = settings
        this.folder = getCurrentFolder()
        this.template = getTemplateFolder()

        this.dirs = [
            // Root
            this.folder,
            this.folder + '/languages',
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
            this.folder + '/includes/abstracts',
            this.folder + '/includes/admin',
            this.folder + '/includes/database',
            this.folder + '/includes/interfaces',
            this.folder + '/includes/models',
            this.folder + '/includes/traits',
            this.folder + '/includes/utilities',
        ]

        series(
            [
                this.directories,
                this.copyIndex,
                this.copyConfigs,
                this.copyTools,
                this.prepareConfigs,
                this.prepareFiles,
                (next) => {
                    heading( 'Installing Composer' )
                    runCommand( 'composer', [ 'install' ], next )
                },
                (next) => {
                    heading( 'Installing Composer' )
                    runCommand( 'composer', [ 'dump' ], next )
                },
                (next) => {
                    if ( 0 === this.settings.awesomePackages.length ) {
                        next()
                        return
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
                    heading( 'Checking GIT repo' )
                    runCommand( 'git rev-parse --is-inside-work-tree && echo "OK" || git init', [], next )
                },
                this.installNpm,
                (next) => {
                    heading( 'Adding Pre-Commit' )
                    runCommand( 'npm run prepare', [], next )
                },
                (next) => {
                    runCommand( 'npx husky add .husky/pre-commit "npx lint-staged"', [], next )
                }
            ],
            ( err, results ) => {
                callback()
            }
        )
    }

    directories = ( next ) => {
        heading( 'Creating directories!!' )

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
        }, next )
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

    copyTools = ( next ) => {
        heading( 'Copying tools files!!' )
        fs.copySync(
            this.template + '/tools',
            this.folder + '/tools',
        )
        next()
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

    installNpm = (next) => {
        heading( 'Installing NPM Packages' )
        const packages =[
            'prettier',
            '@wordpress/eslint-plugin',
            '@wordpress/stylelint-config',
            'async',
            'browser-sync',
            'browser-sync-webpack-plugin',
            'chalk@4.1.2',
            'eslint-plugin-prettier',
            'husky',
            'laravel-mix',
            'laravel-mix-tailwind',
            'lint-staged',
            'resolve-url-loader',
            'sass',
            'sass-loader',
            'shelljs',
            'tailwindcss',
            'webpack',
        ]

        eachSeries( packages, ( pack, nextPackage ) => {
            console.log( chalk.yellow( 'npm i -D ' + pack ) )
            runCommand( 'npm', [ 'i -D ' + pack ], nextPackage )
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
