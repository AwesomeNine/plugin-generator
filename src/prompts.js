/**
 * External dependencies
 */
const { get } = require( 'lodash' )
const inquirer = require( 'inquirer' )
const { kebabCase } = require( 'lodash' )

/**
 * Node dependencies
 */
const { getCacheStore } = require( './helpers' )

module.exports = ( next ) => {
    const cache = getCacheStore()
    let saved = cache.all()
    saved = saved ? saved.answers : {}

    const getCache = ( key, defaultVal = '' ) => get( saved, key, defaultVal )

    const questions = [
        // Company
        {
            type: 'input',
            name: 'company.name',
            message: 'Enter company name',
            default: getCache(  'company.name','Awesome9' ),
        },
        {
            type: 'input',
            name: 'company.url',
            message: 'Enter company website url',
            default: getCache( 'company.url', 'https://awesome9.co' ),
            filter: ( val ) => val.toLowerCase()
        },

        // Author
        {
            type: 'input',
            name: 'author.name',
            message: 'Enter author name',
            default: getCache( 'author.name', 'Shakeeb Ahmed' ),
        },
        {
            type: 'input',
            name: 'author.email',
            message: 'Enter author email',
            default: getCache( 'author.email', 'me@shakeebahmed.com' ),
            filter: ( val ) => val.toLowerCase()
        },
        {
            type: 'input',
            name: 'author.url',
            message: 'Enter author website url',
            default: getCache( 'author.url', 'https://shakeebahmed.com' ),
            filter: ( val ) => val.toLowerCase()
        },

        // WordPress
        {
            type: 'input',
            name: 'wp.textDomain',
            message: 'Enter text domain for i18n',
            default: getCache( 'wp.textDomain' ),
            filter: ( val ) => val.toLowerCase()
        },
        {
            type: 'input',
            name: 'version',
            message: 'Enter plugin version',
            default: getCache( 'version', '1.0.0' ),
            filter: ( val ) => val.toLowerCase()
        },
        {
            type: 'input',
            name: 'wp.name',
            message: 'Enter plugin name',
            default: getCache( 'wp.name' ),
        },
        {
            type: 'input',
            name: 'wp.description',
            message: 'Enter plugin description',
            default: getCache( 'wp.description' ),
        },
        {
            type: 'input',
            name: 'wp.proxy',
            message: 'Enter wordpress installation url',
            default: getCache( 'wp.proxy' ),
        },

        // PHP
        {
            type: 'input',
            name: 'php.package',
            message: 'Enter php package attribute',
            default: getCache( 'php.package' ),
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
            answers.functionName = answers.php.package.toLowerCase().replaceAll( '\\', '_' )

            cache.setKey( 'answers', answers )
            cache.save()
            next( null, answers )
        } )
}
