/**
 * External dependencies
 */
import inquirer from 'inquirer'
import kebabCase from 'lodash/kebabCase.js'

/**
 * Node dependencies
 */
import { getSetting, heading, saveConfig, msgSuccessTitle } from '../utilities/index.js'

export default async () => {
    const questions = [
        // Company
        {
            type: 'input',
            name: 'company.name',
            message: 'Enter company name',
            default: getSetting( 'company.name','Awesome9' ),
        },
        {
            type: 'input',
            name: 'company.url',
            message: 'Enter company website url',
            default: getSetting( 'company.url', 'https://awesome9.co' ),
            filter: ( val ) => val.toLowerCase()
        },

        // Author
        {
            type: 'input',
            name: 'author.name',
            message: 'Enter author name',
            default: getSetting( 'author.name', 'Shakeeb Ahmed' ),
        },
        {
            type: 'input',
            name: 'author.email',
            message: 'Enter author email',
            default: getSetting( 'author.email', 'me@shakeebahmed.com' ),
            filter: ( val ) => val.toLowerCase()
        },
        {
            type: 'input',
            name: 'author.url',
            message: 'Enter author website url',
            default: getSetting( 'author.url', 'https://shakeebahmed.com' ),
            filter: ( val ) => val.toLowerCase()
        },

        // WordPress
        {
            type: 'input',
            name: 'wp.textDomain',
            message: 'Enter text domain for i18n',
            default: getSetting( 'wp.textDomain' ),
            filter: ( val ) => val.toLowerCase()
        },
        {
            type: 'input',
            name: 'wp.version',
            message: 'Enter plugin version',
            default: getSetting( 'version', '1.0.0' ),
            filter: ( val ) => val.toLowerCase()
        },
        {
            type: 'input',
            name: 'wp.name',
            message: 'Enter plugin name',
            default: getSetting( 'wp.name' ),
        },
        {
            type: 'input',
            name: 'wp.description',
            message: 'Enter plugin description',
            default: getSetting( 'wp.description' ),
        },
        {
            type: 'input',
            name: 'wp.proxy',
            message: 'Enter wordpress installation url',
            default: getSetting( 'wp.proxy' ),
        },

        // PHP
        {
            type: 'input',
            name: 'php.package',
            message: 'Enter php package namespace',
            default: getSetting( 'php.package' ),
            filter: ( val ) => val.replace( / /g, '' )
        },
        // Packages
        {
            type: 'checkbox',
            name: 'awesomePackages',
            message: 'Select awesome packages to install',
            default: getSetting(  'company.name','Awesome9' ),
            choices: [
                { value:'awesome9/database', name: 'Database: an expressive WordPress SQL query builder' },
                { value:'awesome9/json', name: 'JSON: ease of managing data localization within WordPress' },
                { value:'awesome9/notifications', name: 'Notifications: ease of managing temporary and permanent notification within WordPress' },
                { value:'awesome9/options', name: 'Options: ease of managing options within WordPress.' },
                { value:'awesome9/requirements', name: 'Requirements: test environment requirements to run your plugin' },
                { value:'awesome9/templates', name: 'Templates: wrapper for WordPress Filesystem and Templates' },
                { value:'awesome9/updates', name: 'Updates: to run update routines within a plugin' },
            ]
        },
    ]

	heading('How you want your plugin?')
    inquirer.prompt( questions )
        .then( ( answers ) => {
            const date = new Date()
            answers.year = date.getFullYear()

            answers.package = {
                vendor: kebabCase( answers.company.name ),
                name: kebabCase( answers.wp.name )
            }
            answers.functionName = answers.php.package
                .toLowerCase()
                .replace( /\\/g, '_' )

			saveConfig( answers )
			msgSuccessTitle('Config file created successfully!')
        } )
}
