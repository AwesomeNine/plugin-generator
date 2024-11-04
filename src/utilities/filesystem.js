/**
 * External dependencies
 */
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import template from 'lodash/template.js';

/**
 * Node dependencies
 */
import path from 'path';
import fs from 'fs-extra';

/**
 * Internal Dependencies
 */
import { write, msgSuccessOnSameLine, onSameLine } from './formatting.js'

let projectRoot = null

/**
 * Get the root folder of the project by searching for a known root file (e.g., package.json).
 *
 * @throws {Error} - Throws an error if the root folder cannot be found.
 *
 * @param {string} startDir - The directory to start searching from. Defaults to the current directory.
 *
 * @returns {string} - The absolute path to the project root folder.
 */
export function getProjectRoot(startDir = process.cwd()) {
	if (projectRoot) {
		return projectRoot;
	}

	projectRoot = startDir;

	while (projectRoot !== path.parse(projectRoot).root) {
		const possibleRootFile = path.join(projectRoot, 'wp.awesome9');
		if (fs.existsSync(possibleRootFile)) {
			return projectRoot;
		}

		// Move up one directory level
		projectRoot = path.dirname(projectRoot);
  }

  throw new Error('Project root not found. Make sure there is a wp.awesome9 file in the root directory.');
}

/**
 * Retrieves the path to the template folder.
 *
 * This function uses `createRequire` to resolve the path to the `../../template` directory
 * relative to the current module's URL and removes the `/index.js` part from the resolved path.
 *
 * @returns {string} The path to the template folder.
 */
export function getTemplateFolder() {
    const dirname = path.dirname(import.meta.url.replace('file://', ''))
    return path.join(dirname, '../../template')
}

/**
 * Retrieves the path to the specified template file.
 *
 * @param {string} file - The name of the file to retrieve.
 *
 * @returns {string} The path to the specified template file.
 */
export function getTemplateFile( file ) {
	return path.join( getTemplateFolder(), file )
}

/**
 * Compiles a template file with the provided data.
 *
 * @param {string} filename - The path to the template file.
 * @param {Object} data - The data to be used in the template.
 *
 * @returns {string} - The compiled template with the data.
 */
export function compileTemplate( filename, data ) {
	const fileContent = fs.readFileSync(filename, 'utf-8');
	const compiled = template(fileContent,{ interpolate: /{{([\s\S]+?)}}/g });

	return compiled(data);
}

/**
 * Deletes a specified file if it exists.
 *
 * @param {string} name - The name of the file to be deleted.
 * @param {string} file - The path to the file to be deleted.
 *
 * @returns {void}
 */
export function deleteFile(name, file) {
    if ( ! fs.existsSync(file) ) {
        console.log( `${logSymbols.error} ${chalk.red(`${name} file not found!`)}` )
        return
    }

    fs.rmSync(file)
    console.log( `${logSymbols.success} ${chalk.dim(`${name} deleted!`)}` )
}

/**
 * Updates the content of a specified file.
 *
 * @param {string} fileName - The name of the file to update.
 * @param {Object} messages - The messages to display during the update process.
 * @param {Function} next - The callback function to call after the update process is complete.
 * @param {Function} callback - The callback function to process the file content.
 *
 * @returns {void}
 */
export function updateFileContent(fileName, messages, next, callback) {
    process.stdout.write(messages.updating)

    fs.readFile(fileName, (err, buffer) => {
        if ( null !== err ) {
            onSameLine(`${logSymbols.error} ${messages.failed}`)
            return next(true)
        }

        const content = callback(buffer.toString())

        fs.writeFile(fileName, content, (err) => {
            if ( null !== err ) {
                onSameLine(`${logSymbols.error} ${messages.failed}`)
                return next(true)
            }

            onSameLine(`${logSymbols.success} ${messages.updated}`)
            next()
        })
    })
}

export function writeFile(folder, filename, content) {
	write('Creating directories!!');
	fs.ensureDirSync(folder);
	msgSuccessOnSameLine('Directories created successfully');

	write('Creating file!!');
	fs.writeFileSync(path.join(folder, filename), content);
	msgSuccessOnSameLine('File created successfully');
}
