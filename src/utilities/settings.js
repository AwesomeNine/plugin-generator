/**
 * External dependencies
 */
import get from 'lodash/get.js'

/**
 * Node dependencies
 */
import fs from 'fs'
import path from 'path'

/**
 * Internal Dependencies
 */
import { getProjectRoot } from './folder.js'

export const configPath = path.join(getProjectRoot(), '.wpawesome9')

/**
 * Checks if the configuration file exists at the specified path.
 *
 * @returns {boolean} True if the configuration file exists, false otherwise.
 */
export function configFileExists() {
	return fs.existsSync(configPath);
}

/**
 * Read JSON data from the config file asynchronously.
 *
 * @returns {Object} - JSON data from the file.
 */
export function readConfigFile() {
	try {
		const data = fs.readFileSync(configPath, 'utf-8');
		return JSON.parse(data);
	} catch (err) {
		return {};
	}
}

/**
 * Save config file
 *
 * @param {Object} data - The data object to save
 */
export function saveConfig(data) {
	console.log('Saving config file...');
	console.log(configPath);
	try {
		const jsonData = JSON.stringify(data, null, 2);
		fs.writeFileSync(configPath, jsonData);
	} catch (err) {
		console.error('Error writing config file:', err);
		throw err;
	}
}

let settings = null
export function getSetting(key, defaultVal = '') {
	if (!settings) {
		settings = readConfigFile();
	}

	return get( settings, key, defaultVal );
}
