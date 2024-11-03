/**
 * External Dependencies
 */
import capitalize from 'lodash/capitalize.js';

/**
 * Node Dependencies
 */
import path from 'path';

/**
 * Internal Dependencies
 */
import { getSetting, writeFile, filenameToHeading, heading, getProjectRoot, msgErrorTitle, getTemplateFile, compileTemplate } from "../utilities/index.js";

function templateName(options)  {
	const length = Object.keys(options).length

	if ( 0 === length ) {
		return 'class-empty';
	}

	const hash = {
		'i': 'class-initializer',
		'g': 'class-integration',
		'r': 'class-rest',
		's': 'class-singleton',
	}
	const has = Object.keys(options)[0]

	return hash[has] ?? 'class-empty';
}

export default (classname, description, options) => {
	heading('Creating class file...')

	try {
		const template = templateName(options);
		const namespace = classname.split('\\');
		const paths = classname.toLowerCase().split('\\');
		const filename = paths.pop() + '.php';
		const folder = path.join(getProjectRoot(), getSetting('paths.php'), paths.join('/'));

		// Data
		const data = getSetting();
		data.heading = description || filenameToHeading(filename) + ' template file';
		data.className = namespace.pop();
		data.namespace = '\\' + namespace.join('\\');

		const content = compileTemplate(getTemplateFile(`files/${template}.php`), data);
		writeFile(folder, `class-${filename}`, content);
	}
	catch (err) {
		msgErrorTitle('We failed!!!');
		throw err;
	}
}
