
/**
 * Node Dependencies
 */
import path from 'path';

/**
 * Internal Dependencies
 */
import { getSetting, writeFile, heading, filenameToHeading, getProjectRoot, msgErrorTitle, getTemplateFile, compileTemplate } from "../utilities/index.js";

export default (name, options) => {
	heading('Creating javascript file...')
    const {
		h: header = null,
		d: description = null,
	} = options

	try {
		const paths = name.toLowerCase().split('\\')
		const filename = paths.pop() + '.js';
		const folder = path.join(getProjectRoot(), getSetting('paths.javascript'), paths.join('/'));

		// Data
		const data = getSetting();
        data.heading = header || filenameToHeading(name) + ' module.';
		data.description = description || 'Description of the module';

		const content = compileTemplate(getTemplateFile('files/javascript.js'), data);
		writeFile(folder, filename, content);
	}
	catch (err) {
		msgErrorTitle('We failed!!!');
		throw err;
	}
}
