/**
 * External dependencies
 */
import fs from 'fs-extra'
import Handlebars from 'handlebars'
import { series, eachSeries } from 'async'

/**
 * Internal dependencies
 */
import { getSettings, getRootFolder, getTemplateFolder, runCommand, msgSuccessOnSameLine, write, execCommand, msgErrorOnSameLine } from '../../utilities/index.js'

class CreateFile {
    run( args, callback ) {
		const { file, singleton = false } = args
        const namespace = file.split('\\')

        this.template = getTemplateFolder()

        // Settings
        this.settings = getSettings()
        this.settings.namespace = ''
        this.settings.className = namespace.pop()
        this.settings.heading = args.file
            .replace(/\\/g, ' ')
            .replace(/_/g, ' ')

        // Filename
        this.fileName = this.settings.className
            .toLowerCase()
            .replace(/_/g, '-')
        this.fileName = `class-${this.fileName}.php`

        // Folder
        this.folder = getRootFolder() + '/includes/'

		// Files
        this.files =[ singleton ? '/file-singleton.php' : '/file.php' ]

        if (namespace.length > 0) {
            this.settings.namespace = '\\' + namespace.join('\\')
            this.folder = this.folder + namespace.join('/').toLowerCase() + '/'
        }

        series(
            [
                this.directories,
                this.prepareFiles,
                (next) => {
					write('Composer Dumping')
					execCommand(
						[ 'composer', 'dump' ],
						(result, err) => {
							if (null !== err) {
								msgErrorOnSameLine('Composer dump failed')
								return next(true)
							}

							msgSuccessOnSameLine('Composer dump successfull')
							next()
						}
					)
				}
            ],
            (err) => {
				if (err) {
					return callback(true)
				}

				callback()
			}
        )
    }

    directories = ( next ) => {
        write( 'Creating directories...' )
        this.dirs = [
            this.folder,
        ]

        eachSeries( this.dirs, ( dir, nextDir ) => {
            fs.ensureDir( dir ).then( nextDir )
        }, () => {
			msgSuccessOnSameLine('Directories created')
            next()
        } )
    }

    prepareFiles = ( next ) => {
		write( 'Creating plugin files...' )
        const template = this.template + '/make'

        eachSeries( this.files, ( file, nextFile ) => {
            this.renderFile( template + file, this.folder + this.fileName, nextFile )
        }, () => {
			msgSuccessOnSameLine('Files created')
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
