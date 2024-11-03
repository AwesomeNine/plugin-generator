
/**
 * Node Dependencies
 */
import path from 'path';

/**
 * Internal Dependencies
 */
import { getSetting, writeFile, heading, filenameToHeading, getProjectRoot, msgErrorTitle, getTemplateFile, compileTemplate } from "../utilities/index.js";

export default (name, description, options) => {
	heading('Creating CSS file...')

	try {
		const paths = name.toLowerCase().split('\\')
		const filename = paths.pop() + '.scss';
		const folder = path.join(getProjectRoot(), getSetting('paths.scss'), paths.join('/'));

		// Data
		const data = getSetting();
		data.heading = description || filenameToHeading(name) + ' styles.';

		const content = compileTemplate(getTemplateFile('files/stylesheet.scss'), data);
		writeFile(folder, filename, content);
	}
	catch (err) {
		msgErrorTitle('We failed!!!');
		throw err;
	}
}
