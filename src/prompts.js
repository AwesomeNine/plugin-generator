/**
 * External dependencies
 */
const inquirer = require( 'inquirer' )
const { capitalize, kebabCase } = require( 'lodash' )

module.exports = ( next ) => {
    const questions = [
        // Company
        {
            type: 'input',
            name: 'company.name',
            message: 'Enter company name'
        },
        {
            type: 'input',
            name: 'company.url',
            message: 'Enter company website url',
            filter: ( val ) => val.toLowerCase()
        },

        // Author
        {
            type: 'input',
            name: 'author.name',
            message: 'Enter author name'
        },
        {
            type: 'input',
            name: 'author.email',
            message: 'Enter author email',
            filter: ( val ) => val.toLowerCase()
        },
        {
            type: 'input',
            name: 'author.url',
            message: 'Enter author website url',
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
                name: kebabCase( answers.wp.name )
            }

            // answers.php = {
            //     package: capitalize( answers.wp.name ).replace( / /g, '' )
            // }

            next( null, answers )
        } )
}
