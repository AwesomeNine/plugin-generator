/**
 * Node Dependencies
 */
import path from 'path';
import fs from 'fs-extra';

/**
 * Internal Dependencies
 */
import { getSetting, writeFile, heading, getProjectRoot, msgErrorTitle, getTemplateFile, compileTemplate } from "../utilities/index.js";

export default (version) => {
	heading('Creating update file...')

	try {
		const filename = `upgrade-${version}.php`;
		const folder = path.join(getProjectRoot(), getSetting('paths.updates'));

		// Data
		const data = getSetting();
		data.heading = `Update routine for version ${version}`;
		data.version = version.replaceAll('.', '_');

		const content = compileTemplate(getTemplateFile('files/update.php'), data);
		writeFile(folder,filename, content)
	}
	catch (err) {
		msgErrorTitle('We failed!!!');
		throw err;
	}
}
