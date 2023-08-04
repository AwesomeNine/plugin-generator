#!/usr/bin/env node

/**
 * External dependencies
 */
import chalk from 'chalk'

/**
 * Internal Dependencies
 */
import { getCommand } from './utilities/index.js'
import packageDetails from '../package.json' assert { type: "json" }

/**
 * Commands
 */
import * as commands from './commands/index.js'

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
        commands.help()
    }

    if ( 'make:plugin' === command ) {
        commands.makePlugin(args)
    }

    if ( 'make:file' === command ) {
       commands.makeFile(args)
    }
}

app()
