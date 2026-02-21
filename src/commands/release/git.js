/**
 * External Dependencies
 */
import logSymbols from 'log-symbols'

/**
 * Internal Dependencies
 */
import { pluginData } from '../release.js'
import { execCommand, onSameLine, getSetting, write } from "../../utilities/index.js"

export function initGitRepository(next) {
	write( 'Initializing Git repository...' )
	execCommand('git rev-parse --is-inside-work-tree && echo "OK" || git init', function() {
		onSameLine(`${logSymbols.success} Git repository initialized`)
		next()
	})
}

/**
 * Get latest tag from GitHub
 */
export function getLatestTag() {
    return new Promise((resolve, reject) => {
        try {
            execCommand( 'git describe --tags --abbrev=0', function(version) {
                version = version.trim().replace(/^v/, '')
                resolve( '' !== version ? version : getSetting( 'wp.version', '0.0.0' ) )
            } )
        }
        catch (err) {
            reject(err)
        }
    })
}

/**
 * Check if user has permission to write to repo
 */
export function hasPermission(next) {
    const message = 'Checking github write permission'

    write(`${message}....`)

    execCommand('git push --dry-run', function(result, error, stderr) {
        if (stderr.includes('error:') || stderr.includes('fatal:')) {
            onSameLine(`${logSymbols.error} ${message}`)
            return next(true)
        }

        onSameLine(`${logSymbols.success} ${message}`)
        next()
    })
}

/**
 * Fetch remote changes
 */
export function gitFetch(next) {
    const message = 'Fetching remote changes'

    write(`${message}....`)

    execCommand('git fetch', function(result, error, stderr) {
        if (stderr.includes('error:') || stderr.includes('fatal:')) {
            onSameLine(`${logSymbols.error} ${message}`)
            return next(true)
        }

        onSameLine(`${logSymbols.success} Remote changes fetched`)
        next()
    })
}

/**
 * Verify if the tag already exists or not
 */
export function verifyNextVersion(next) {
    const message = 'Verifying next version'
    const version = pluginData.semver.getNextVersionString()
    const tag = 'refs/tags/v' + version

    write(`${message}....`)

    execCommand(`git rev-parse ${tag}`, function(result, error, stderr) {
        if (null === error) {
            onSameLine(`${logSymbols.error} Version tag: v${version} already exists.`)
            return next(true)
        }

        onSameLine(`${logSymbols.success} Version tag verified`)
        next()
    })
}

/**
 * Get current branch name
 */
export function getCurrentBranchName(next) {
    execCommand('git rev-parse --abbrev-ref HEAD', function(result) {
        pluginData.gitCurrentBranch = result.trim()

        next()
    })
}
