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
        // Product
        {
            type: 'input',
            name: 'product.name',
            message: 'The name of your plugin/theme',
            default: getSetting( 'product.name','Awesome9' ),
        },
        {
            type: 'input',
            name: 'product.uri',
            message: 'The home page of the plugin/theme',
            default: getSetting( 'product.url', 'https://awesome9.co' ),
            filter: ( val ) => val.toLowerCase()
        },
		{
            type: 'input',
            name: 'product.description',
            message: 'A short description of the plugin/theme',
            default: getSetting( 'product.description' ),
        },
		{
            type: 'input',
            name: 'product.version',
            message: 'The current version number of the plugin/theme',
            default: getSetting( 'product.version', '1.0.0' ),
            filter: ( val ) => val.toLowerCase()
        },

        // Author
        {
            type: 'input',
            name: 'author.name',
            message: 'The name of the author. Multiple authors may be listed using commas',
            default: getSetting( 'author.name', 'Shakeeb Ahmed' ),
        },
        {
            type: 'input',
            name: 'author.email',
            message: 'The email of the author',
            default: getSetting( 'author.email', 'me@shakeebahmed.com' ),
            filter: ( val ) => val.toLowerCase()
        },
        {
            type: 'input',
            name: 'author.url',
            message: 'The author’s website or profile on another website',
            default: getSetting( 'author.url', 'https://shakeebahmed.com' ),
            filter: ( val ) => val.toLowerCase()
        },

        // WordPress
		{
            type: 'input',
            name: 'wp.requireWP',
            message: 'The lowest WordPress version that the plugin/theme will work on',
            default: getSetting( 'wp.requireWP', '6.0' ),
            filter: ( val ) => val.toLowerCase()
        },
		{
            type: 'input',
            name: 'wp.requirePHP',
            message: 'The minimum required PHP version',
            default: getSetting( 'wp.requirePHP', '7.4' ),
            filter: ( val ) => val.toLowerCase()
        },
        {
            type: 'input',
            name: 'wp.textDomain',
            message: 'The gettext text domain of the plugin/theme',
            default: getSetting( 'wp.textDomain' ),
            filter: ( val ) => val.toLowerCase()
        },

		// Paths
		{
            type: 'input',
            name: 'paths.php',
            message: 'The source files of the plugin/theme',
            default: getSetting( 'paths.php', 'includes' ),
            filter: ( val ) => val.toLowerCase()
        },
		{
            type: 'input',
            name: 'paths.views',
            message: 'The path to views folder of the plugin/theme',
            default: getSetting( 'paths.views', 'views' ),
            filter: ( val ) => val.toLowerCase()
        },
		{
            type: 'input',
            name: 'paths.updates',
            message: 'The path to updates folder of the plugin/theme',
            default: getSetting( 'paths.updates', 'updates' ),
            filter: ( val ) => val.toLowerCase()
        },
		{
            type: 'input',
            name: 'paths.javascript',
            message: 'The path to javascript folder of the plugin/theme',
            default: getSetting( 'paths.javascript', 'assets/src' ),
            filter: ( val ) => val.toLowerCase()
        },
		{
            type: 'input',
            name: 'paths.scss',
            message: 'The path to scss folder of the plugin/theme',
            default: getSetting( 'paths.scss', 'assets/scss' ),
            filter: ( val ) => val.toLowerCase()
        },
        // Misc
        {
            type: 'input',
            name: 'misc.package',
            message: 'Enter php package namespace',
            default: getSetting( 'misc.package' ),
            filter: ( val ) => val.replace( / /g, '' )
        },

        {
            type: 'input',
            name: 'misc.proxy',
            message: 'Enter wordpress installation url',
            default: getSetting( 'misc.proxy' ),
        },
        {
            type: 'checkbox',
            name: 'awesomePackages',
            message: 'Select awesome packages to install',
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
                vendor: kebabCase( answers.author.name ),
                name: kebabCase( answers.product.name )
            }
            answers.functionName = answers.misc.package
                .toLowerCase()
                .replace( /\\/g, '_' )

			answers.wp.textDomain = answers.wp.textDomain || answers.package.name
			answers.wp.shortname = answers.wp.textDomain.toUpperCase()
				.replaceAll( '-', '' )
				.replaceAll( '_', '' )
			answers.wp.upgradeOptionName = answers.wp.textDomain.replaceAll( '-', '_' ) + '_version'

			saveConfig( answers )
			msgSuccessTitle('Config file created successfully!')
        } )
}
