import { heading, onNewLine } from "../../helpers.js"

export function execute() {
    heading('Help Command Menu')
    onNewLine('List of commands')
    console.log('    npx wp-awesome9 make:plugin');
    console.log('    npx wp-awesome9 make:plugin --folder=my-awesome-plugin');
    console.log('    npx wp-awesome9 make:file --file="Dashboard"');
    console.log('    npx wp-awesome9 make:file --file="Admin\\Report\\Dashboard"');
}
