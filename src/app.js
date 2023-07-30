#!/usr/bin/env node

/**
 * External dependencies
 */
import chalk from 'chalk'
import { waterfall } from 'async'
import logSymbols from 'log-symbols'

/**
 * Internal Dependencies
 */
import { getCommand } from './helpers.js'
import packageDetails from '../package.json' assert { type: "json" }

/**
 * Commands
 */
import { execute as helpCommand } from './commands/help/index.js'
import { execute as pluginCommand } from './commands/plugin/index.js'
import { execute as fileCommand } from './commands/file/index.js'

/**
 * App
 */
const app = async () => {
    console.log(
        [
            chalk.hex('#FADC00').inverse.bold('Awesome WordPress Plugin Scaffolding'),
            chalk.white( 'v' + packageDetails.version ),
            chalk.dim( 'by Shakeeb Ahmed' )
        ].join(" ")
    );

    const { command, args } = getCommand()
    if ( 'help' === command ) {
        helpCommand()
    }

    if ( 'make:plugin' === command ) {
        pluginCommand(args)
    }

    if ( 'make:file' === command ) {
       fileCommand(args)
    }
}

app()
