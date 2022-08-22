#!/usr/bin/env node

/**
 * External dependencies
 */
const waterfall = require( 'async/waterfall' )
const logSymbols = require( 'log-symbols' )
const chalk = require( 'chalk' )
const green = chalk.bold.green

/**
 * Internal dependencies
 */
const prompts = require( './prompts' )
const createFile = require('./create-file')
const createPlugin = require( './create-plugin' )
const { getCommand } = require( './helpers' )

/**
 * App
 */
const app = async () => {
    const { command, args } = getCommand()

    if ( 'make:file' === command ) {
        waterfall(
            [
                function( next ) {
                    next(null, args)
                },
                createFile,
            ],
            ( err, results ) => {
                console.log( `${logSymbols.success} ${green(`All done!`)}` )
            }
        )
    }

    if ( 'make:plugin' === command ) {
        waterfall(
            [
                prompts,
                createPlugin,
            ],
            ( err, results ) => {
                console.log( `${logSymbols.success} ${green(`All done!`)}` )
            }
        )
    }
}

app()
