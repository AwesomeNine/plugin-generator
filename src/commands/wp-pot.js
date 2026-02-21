/**
 * Internal Dependencies
 */
import { heading, msgSuccess, runCommand, getSetting } from "../utilities/index.js"

export default (next = null) => {
    heading('Generating PO and MO files...')

    const settings = getSetting()

    const output = settings.wpPot.output;
    const file = settings.wpPot.file;
    const domain = settings.wpPot.domain;
    const headers = {
        'Last-Translator': 'Awesome9 <support@awesome9.co>',
        'Language-Team': 'Awesome9 <support@awesome9.co>',
    };
    const exclude = [
        '.git',
        '.github',
        '.husky',
        '.wordpress-org',
        'node_modules',
        'packages',
        'tools',
        'vendor',
    ];

    // Execute.
    const rootPath = process.cwd();
    const command = [
        'wp i18n make-pot',
        rootPath,
        rootPath + output + file,
        `--domain=${domain}`,
        `--exclude=${exclude.join(',')}`,
        `--headers='${JSON.stringify(headers)}'`,
    ];

    runCommand( command.join(' '), [], () => {
        msgSuccess('PO and MO files generated successfully');
        if (next) next();
    } );
}
