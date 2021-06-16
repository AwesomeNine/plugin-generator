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
            name: 'wp.version',
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
    ]

    inquirer.prompt( questions )
        .then( ( answers ) => {
            answers.package = {
                name: kebabCase( answers.wp.name )
            }

            next( null, answers )
        } )
}
