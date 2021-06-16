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
const createPlugin = require( './create-plugin' )
/**
 * App
 */
const app = async () => {

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

app()
