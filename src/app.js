#!/usr/bin/env node

/**
 * External dependencies
 */
import { waterfall } from 'async'
import logSymbols from 'log-symbols'
import chalk from 'chalk'
const green = chalk.bold.green

/**
 * Internal dependencies
 */
import prompts from './prompts.js'
import createFile from './create-file.js'
import createPlugin from './create-plugin.js'
import { getCommand } from './helpers.js'

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
