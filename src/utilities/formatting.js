/**
 * External dependencies
 */
import chalk from 'chalk'
import logSymbols from 'log-symbols'

/**
 * Print heading.
 *
 * @param {String} title Title to print
 *
 * @returns {void}
 */
export function heading(title) {
    console.log('')
    console.log( chalk.bold.green( 'Ⓞ  ' + title ) )
}

/**
 * Print text on new line.
 *
 * @param {String} text Text to print
 *
 * @returns {void}
 */
export function onNewLine(text) {
    console.log('')
    console.log(text)
}

/**
 * Print text on same line by clearing buffer.
 *
 * @param {String} text Text to print
 *
 * @returns {void}
 */
export function onSameLine(text) {
	if (process.stdout.clearLine) {
		process.stdout.clearLine(); // Clear the current line
		process.stdout.cursorTo(0);  // Move the cursor to the start of the line
		// process.stdout.write(message);
	}

    console.log(text)
}

/**
 * Print text on same line by clearing buffer.
 *
 * @param {String} text Text to print
 *
 * @returns {void}
 */
export function msgSuccessOnSameLine(text) {
    onSameLine(`${logSymbols.success} ${text}`)
}

/**
 * Print text on same line by clearing buffer.
 *
 * @param {String} text Text to print
 *
 * @returns {void}
 */
export function msgErrorOnSameLine(text) {
    onSameLine(`${logSymbols.error} ${text}`)
}

/**
 * Print success text in bold green font
 *
 * @param {String} msg Text to print
 *
 * @returns {void}
 */
export function msgSuccessTitle(msg) {
	console.log( `${logSymbols.success} ${chalk.bold.green(`${msg}`)}` )
}

/**
 * Print error text in bold green font
 *
 * @param {String} msg Text to print
 *
 * @returns {void}
 */
export function msgErrorTitle(msg) {
	console.log( `${logSymbols.error} ${chalk.bold.magenta(`${msg}`)}` )
}

/**
 * Write text on current buffer
 *
 * @param {String} text Text to write
 *
 * @returns {void}
 */
export function write(text) {
	process.stdout.write(text)
}
