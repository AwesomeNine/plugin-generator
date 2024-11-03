/**
 * External dependencies
 */
import get from 'lodash/get.js'
import set from 'lodash/set.js'

/**
 * Node dependencies
 */
import fs from 'fs'
import path from 'path'

/**
 * Internal Dependencies
 */
import { getProjectRoot } from './filesystem.js'

let settings = null
const savePath = path.join(process.cwd(), '.wpawesome9')
const configPath = path.join(getProjectRoot(), '.wpawesome9')

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
	try {
		const jsonData = JSON.stringify(data, null, 2);
		fs.writeFileSync(savePath, jsonData);
	} catch (err) {
		console.error('Error writing config file:', err);
		throw err;
	}
}

/**
 * Get setting from the config file
 *
 * @param {string} key - The key to get the value for
 * @param {string} defaultVal - The default value to return if key is not found
 *
 * @returns {string} - The value of the key
 */
export function getSetting(key = 'all', defaultVal = '') {
	if (!settings) {
		settings = readConfigFile();
	}

	if ( 'all' === key ) {
		return settings;
	}

	return get( settings, key, defaultVal );
}

export function updateSetting(key, value) {
	if (!settings) {
		settings = readConfigFile();
	}

	settings = set(settings, key, value);
	saveConfig(settings);
}
