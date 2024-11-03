/**
 * External Dependencies
 */
import capitalize from 'lodash/capitalize.js';

/**
 * Node Dependencies
 */
import path from 'path';
import fs from 'fs-extra';

/**
 * Internal Dependencies
 */
import { getSetting, write, heading, getProjectRoot, msgErrorTitle, msgSuccessOnSameLine, getTemplateFile, compileTemplate } from "../utilities/index.js";

export default (version) => {
	heading('Creating update file...')

	try {
		const filename = `upgrade-${version}.php`;
		const folder = path.join(getProjectRoot(), getSetting('paths.updates'));

		// Data
		const data = getSetting();
		data.heading = `Update routine for version ${version}`;
		data.version = version.replaceAll('.', '_');

		write('Creating directories!!');
		fs.ensureDirSync(folder);
		msgSuccessOnSameLine('Directories created successfully');

		write('Creating file!!');
		const content = compileTemplate(getTemplateFile('files/update.php'), data);
		fs.writeFileSync(path.join(folder, filename), content);
		msgSuccessOnSameLine('File created successfully');
	}
	catch (err) {
		msgErrorTitle('We failed!!!');
		throw err;
	}
}
