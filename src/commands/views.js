/**
 * Node Dependencies
 */
import path from 'path';
import fs from 'fs-extra';

/**
 * Internal Dependencies
 */
import { getSetting, write, heading, getProjectRoot, msgErrorTitle, msgSuccessOnSameLine, getTemplateFile, compileTemplate } from "../utilities/index.js";

export default (name) => {
	heading('Creating view file...')

	try {
		const data = getSetting();
		const paths = name.split('\\')
		const filename = paths.pop() + '.php';
		const folder = path.join(getProjectRoot(), getSetting('paths.views'), paths.join('/'));

		write('Creating directories!!');
		fs.ensureDirSync(folder);
		msgSuccessOnSameLine('Directories created successfully');

		write('Creating file!!');
		data.heading = 'This is a view file';
		const content = compileTemplate(getTemplateFile('files/view.php'), data);
		fs.writeFileSync(path.join(folder, filename), content);
		msgSuccessOnSameLine('File created successfully');
	}
	catch (err) {
		msgErrorTitle('We failed!!!');
		throw err;
	}
}
