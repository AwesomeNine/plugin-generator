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
import { getSetting, writeFile, filenameToHeading, heading, getProjectRoot, msgErrorTitle, getTemplateFile, compileTemplate, runCommand } from "../utilities/index.js";

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

export default (classname, options) => {
	heading('Creating class file...')
    const {
		h: header = null,
		d: description = null,
	} = options

	try {
		const template = templateName(options);
		const namespace = classname.split('\\');
		const paths = classname.toLowerCase().split('\\');
		const filename = paths.pop().replace(/_/g, '-') + '.php';
		const folder = path.join(getProjectRoot(), getSetting('paths.php'), paths.join('/'));;

		// Data
		const data = getSetting();
		data.heading = header || filenameToHeading(filename) + ' template file';
		data.description = description || 'Brief description of the styles in this file';
		data.className = namespace.pop();
		data.namespace = namespace.length > 0 ? '\\' + namespace.join('\\') : '';

		const content = compileTemplate(getTemplateFile(`files/${template}.php`), data);
		writeFile(folder, `class-${filename}`, content);
		runCommand( 'composer', [ 'dump' ], () => {} );
	}
	catch (err) {
		msgErrorTitle('We failed!!!');
		throw err;
	}
}
