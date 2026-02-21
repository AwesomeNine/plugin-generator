/**
 * External Dependencies
 */
import { waterfall } from 'async'
import logSymbols from 'log-symbols'

/**
 * Internal Dependencies
 */
import { pluginData } from '../release.js'
import { execCommand, heading, onSameLine, write } from "../../utilities/index.js"
import {
    hasPermission,
    gitFetch,
    verifyNextVersion,
    getCurrentBranchName
} from './git.js'

/**
 * Execute routine
 */
export function githubPreTasks(next) {
    heading('Github operations')

    waterfall(
        [
            hasPermission,
            gitFetch,
            verifyNextVersion,
            getCurrentBranchName,
        ],
        ( err, results ) => {
            if(err) {
                return next(true)
            }
            next()
        }
    )
}

/**
 * Execute routine
 */
export function githubFinalTasks(next) {
    heading('Github operations')

    write('Committing to GitHub...')

    const version = pluginData.semver.getNextVersionString()
    const message = pluginData.commitMessages.join('\n')

    execCommand('git add .', function() {
        execCommand(`git commit --no-verify -m 'bump version to ${version}' -m '${message}'`, function() {
            execCommand('git push', function() {
                onSameLine(`${logSymbols.success} Git commit successful`)
                next()
            })
        })
    })
}
