
/**
 * Node Dependencies
 */
import path from 'path';

/**
 * Internal Dependencies
 */
import { getSetting, writeFile, heading, filenameToHeading, getProjectRoot, msgErrorTitle, getTemplateFile, compileTemplate } from "../utilities/index.js";

export default (name, description) => {
	heading('Creating view file...')

	try {
		const paths = name.toLowerCase().split('\\')
		const filename = paths.pop() + '.php';
		const folder = path.join(getProjectRoot(), getSetting('paths.views'), paths.join('/'));

		// Data
		const data = getSetting();
		data.heading = description || filenameToHeading(filename) + ' template file';

		const content = compileTemplate(getTemplateFile('files/view.php'), data);
		writeFile(folder, filename, content);
	}
	catch (err) {
		msgErrorTitle('We failed!!!');
		throw err;
	}
}
