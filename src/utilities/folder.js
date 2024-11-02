/**
 * Node dependencies
 */
import fs from 'fs'
import path from 'path'
import { createRequire } from 'node:module'

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
		const possibleRootFile = path.join(projectRoot, 'package.json');
		if (fs.existsSync(possibleRootFile)) {
			return projectRoot;
		}

		// Move up one directory level
		projectRoot = path.dirname(projectRoot);
  }

  throw new Error('Project root not found. Make sure there is a package.json file in the root directory.');
}

export function getTemplateFolder() {
    const require = createRequire( import.meta.url )
    return require.resolve( '../../template' )
        .replace( '/index.js', '' )
}
