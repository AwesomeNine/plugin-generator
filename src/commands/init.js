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
            name: 'wp.name',
            message: 'The name of your plugin/theme',
            default: getSetting( 'wp.name', 'Awesome9' ),
        },
		{
            type: 'input',
            name: 'wp.description',
            message: 'A short description of the plugin/theme',
            default: getSetting( 'wp.description' ),
        },
		{
            type: 'input',
            name: 'wp.version',
            message: 'The current version number of the plugin/theme',
            default: getSetting( 'wp.version', '1.0.0' ),
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
        {
            type: 'input',
            name: 'wp.glotpress',
            message: 'The glotpress project slug',
            default: getSetting( 'wp.glotpress' ),
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
            name: 'paths.css',
            message: 'The path to css folder of the plugin/theme',
            default: getSetting( 'paths.css', 'assets/css' ),
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
            name: 'misc.prefix',
            message: 'Enter prefix to be used for functions',
            default: getSetting( 'misc.prefix' ),
        },
        {
            type: 'input',
            name: 'misc.constprefix',
            message: 'Enter prefix to be used for constants',
            default: getSetting( 'misc.constprefix' ),
        },
    ]

	heading('How you want your plugin?')
    inquirer.prompt( questions )
        .then( ( answers ) => {
            const date = new Date()
            answers = {
                ...answers,
                year: date.getFullYear(),
                company: {
                    name: 'Awesome9',
                    url: 'https://awesome9.co/',
                },
                author: {
                    name: 'Awesome9',
                    email: 'info@awesome9.co',
                    url: 'https://awesome9.co/',
                }
            }

            answers.package = {
                vendor: kebabCase( answers.company.name ),
                name: kebabCase( answers.wp.name )
            }
			answers.wp.textDomain = answers.wp.textDomain || answers.package.name

            // Glotpress
            answers.glotpress = false
            if (answers.wp.glotpress) {
                answers.glotpress = {
                    project: answers.wp.glotpress,
                    destination: "./languages/",
                }
            }

            answers.wpPot = {
                output: "/languages/",
                file: `${answers.wp.textDomain}.pot`,
                domain: answers.wp.textDomain
            }

			saveConfig( answers )
			msgSuccessTitle('Config file created successfully!')
        } )
}
