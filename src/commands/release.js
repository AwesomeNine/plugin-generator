/**
 * External Dependencies
 */
import chalk from 'chalk'
import { waterfall } from 'async'
import logSymbols from 'log-symbols'

/**
 * Node dependencies
 */
import { heading } from '../utilities/index.js'

/**
 * Internal Dependencies
 */
import prompts from './release/prompts.js'
import getSemVer from './release/semver.js'
import { githubPreTasks, githubFinalTasks } from './release/github.js'
import updateTranslations from './release/translations.js'
import updateChangelog from './release/changelog.js'
import updateVersionNumber from './release/change-version.js'
import wpBuild from './build.js'

export const pluginData = {
    commitMessages: [],
    changelogChanges: false,
    locales: {},
}

export default async () => {
    heading('Releasing the plugin...')
    console.log('------------------------------------------------');

    waterfall(
        [
            prompts,
            getSemVer,
            githubPreTasks,
            updateTranslations,
            wpBuild,
            updateVersionNumber,
            updateChangelog,
            githubFinalTasks
        ],
        ( err, results ) => {
            if (err) {
                console.log('');
                console.log( `${logSymbols.error} ${chalk.bold.red(`We failed somewhere! Work hard mate...`)}` )
                return
            }

            console.log('');
            console.log( `${logSymbols.success} ${chalk.bold.green(`All done!`)}` )
        }
    )
}
