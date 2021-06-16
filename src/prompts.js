/**
 * External dependencies
 */
const inquirer = require( 'inquirer' )
const { kebabCase } = require( 'lodash' )

module.exports = ( next ) => {
    const questions = [
        // Company
        {
            type: 'input',
            name: 'company.name',
            message: 'Enter company name',
            default: 'Awesome9'
        },
        {
            type: 'input',
            name: 'company.url',
            message: 'Enter company website url',
            default: 'https://awesome9.co',
            filter: ( val ) => val.toLowerCase()
        },

        // Author
        {
            type: 'input',
            name: 'author.name',
            message: 'Enter author name',
            default: 'Shakeeb Ahmed'
        },
        {
            type: 'input',
            name: 'author.email',
            message: 'Enter author email',
            default: 'me@shakeebahmed.com',
            filter: ( val ) => val.toLowerCase()
        },
        {
            type: 'input',
            name: 'author.url',
            message: 'Enter author website url',
            default: 'https://shakeebahmed.com',
            filter: ( val ) => val.toLowerCase()
        },

        // WordPress
        {
            type: 'input',
            name: 'wp.textDomain',
            message: 'Enter text domain for i18n',
            filter: ( val ) => val.toLowerCase()
        },
        {
            type: 'input',
            name: 'version',
            message: 'Enter plugin version',
            default: '1.0.0',
            filter: ( val ) => val.toLowerCase()
        },
        {
            type: 'input',
            name: 'wp.name',
            message: 'Enter plugin name'
        },
        {
            type: 'input',
            name: 'wp.description',
            message: 'Enter plugin description'
        },

        // PHP
        {
            type: 'input',
            name: 'php.package',
            message: 'Enter php package attribute',
            filter: ( val ) => val.replace( / /g, '' )
        },
    ]

    inquirer.prompt( questions )
        .then( ( answers ) => {
            const date = new Date()

            answers.year = date.getFullYear()
            answers.package = {
                vendor: kebabCase( answers.company.name ),
                name: kebabCase( answers.wp.name )
            }

            next( null, answers )
        } )
}
