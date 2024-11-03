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
import { getSetting, writeFile, heading, getProjectRoot, msgErrorTitle, getTemplateFile, compileTemplate } from "../utilities/index.js";

function filenameToHeading(filename) {
	filename = filename.replace('.php', '');
	filename = filename.replace(/-/g, ' ');

	return capitalize(filename);
}

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
	console.log(options, has);


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
		writeFile(folder, filename, content);
	}
	catch (err) {
		msgErrorTitle('We failed!!!');
		throw err;
	}
}
