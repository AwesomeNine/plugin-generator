import path from 'path'

import { pluginData } from '../plugin.js'
import { getSetting } from '../../utilities/settings.js'
import { getTemplateFolder } from '../../utilities/filesystem.js'

export function init(next) {
	pluginData.folder = process.cwd()
	pluginData.settings = getSetting()
	pluginData.template = getTemplateFolder()
	pluginData.includeFolder = path.join(pluginData.folder, pluginData.settings.paths.php)

	pluginData.dirs = [
		// Root
		path.join(pluginData.folder, 'languages'),
		path.join(pluginData.folder, 'tests'),
		path.join(pluginData.folder, 'tests/Acceptance'),
		path.join(pluginData.folder, 'tests/Unit'),
		path.join(pluginData.folder, pluginData.settings.paths.views),
		path.join(pluginData.folder, pluginData.settings.paths.updates),

		// Assets
		path.join(pluginData.folder, 'assets'),
		path.join(pluginData.folder, 'assets/img'),
		path.join(pluginData.folder, 'src'),

		// Includes
		pluginData.includeFolder,
		path.join(pluginData.includeFolder, 'abstracts'),
		path.join(pluginData.includeFolder, 'admin'),
		path.join(pluginData.includeFolder, 'admin/pages'),
		path.join(pluginData.includeFolder, 'frontend'),
		path.join(pluginData.includeFolder, 'installation'),
		path.join(pluginData.includeFolder, 'utilities'),
	]

	next()
}
