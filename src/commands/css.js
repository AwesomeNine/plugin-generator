
/**
 * Node Dependencies
 */
import path from 'path';

/**
 * Internal Dependencies
 */
import { getSetting, writeFile, heading, filenameToHeading, getProjectRoot, msgErrorTitle, getTemplateFile, compileTemplate } from "../utilities/index.js";

export default (name, options) => {
	heading('Creating CSS file...')
	const {
		h: header = null,
		d: description = null,
	} = options

	try {
		const paths = name.toLowerCase().split('\\')
		const filename = paths.pop() + '.css';
		const folder = path.join(getProjectRoot(), getSetting('paths.css'), paths.join('/'));

		// Data
		const data = getSetting();
		data.heading = header || filenameToHeading(name) + ' styles.';
		data.description = description || 'Brief description of the styles in this file';

		const content = compileTemplate(getTemplateFile('files/stylesheet.css'), data);
		writeFile(folder, filename, content);
	}
	catch (err) {
		msgErrorTitle('We failed!!!');
		throw err;
	}
}
