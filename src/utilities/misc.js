/**
 * External Dependencies
 */
import capitalize from 'lodash/capitalize.js';

export function filenameToHeading(filename) {
	filename = filename.replace('.php', '');
	filename = filename.replace('.js', '');
	filename = filename.replace(/-/g, ' ');

	return capitalize(filename);
}
