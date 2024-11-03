
/**
 * Node Dependencies
 */
import path from 'path';

/**
 * Internal Dependencies
 */
import { getSetting, writeFile, heading, filenameToHeading, getProjectRoot, msgErrorTitle, getTemplateFile, compileTemplate } from "../utilities/index.js";

export default (name, description) => {
	heading('Scaffoling plugin...')

	try {
	}
	catch (err) {
		msgErrorTitle('We failed!!!');
		throw err;
	}
}
