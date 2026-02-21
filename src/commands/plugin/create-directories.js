import fs from 'fs-extra'
import { eachSeries } from 'async'

import { pluginData } from '../plugin.js'
import { getTemplateFile } from '../../utilities/filesystem.js'
import { write } from '../../utilities/formatting.js'
import { msgSuccessOnSameLine } from '../../utilities/formatting.js'

export function createDirectories(next) {
	const indexFile = getTemplateFile('files/silence.php')

	write('Creating directories required for the plugin...')

	eachSeries( pluginData.dirs, ( dir, nextDir ) => {
		fs.ensureDir( dir ).then(() => {
			fs.copy( indexFile, dir + '/index.php' ).then( nextDir )
		})
	}, () => {
		msgSuccessOnSameLine(`${pluginData.dirs.length} directories created`)
		next()
	} )
}
