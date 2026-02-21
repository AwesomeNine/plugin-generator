/**
 * External Dependencies
 */
import chalk from 'chalk'
import logSymbols from 'log-symbols'

/**
 * Internal Dependencies
 */
import { pluginData } from '../release.js'
import { getLatestTag } from './git.js'
import { heading, onSameLine, write } from "../../utilities/index.js"

const VERSION_NAMES = [ 'major', 'minor', 'patch' ]
const PRE_RELEASE_NAMES = [ 'alpha', 'beta', 'rc' ]

/**
 * Semantic version generator
 */
class SemVer {
    constructor(baseVersion, increment, preRelease) {
        this.baseVersion = baseVersion
        this.increment = increment
        this.preRelease = preRelease
        this.nextVersion = false
        this.versionString = undefined

        if ( ! VERSION_NAMES.includes(increment) ) {
            console.log(`${logSymbols.error} ${chalk.bold.red(`Failed!`)} Please supply next release by specifying one of ${VERSION_NAMES.join(', ')}.`)
            throw new Error('failed')
        }

        if ( preRelease && ! PRE_RELEASE_NAMES.includes(preRelease) ) {
            console.log(`${logSymbols.error} ${chalk.bold.red(`Failed!`)} Please supply the pre-release version by specifying one of ${PRE_RELEASE_NAMES.join(', ')}.`)
            throw new Error('failed')
        }

        this.parseVersion()
        this.setupNextVersion()
    }

    parseVersion() {
        const regex = new RegExp('(?<major>\\d+)\\.(?<minor>\\d+)\\.(?<patch>\\d+)(?:-(?<pre>alpha|beta|rc))?(?:\\.(?<pre_count>\\d+))?', 'gm')
        this.baseVersion = { ...regex.exec(this.baseVersion).groups }

        this.baseVersion.major = parseInt(this.baseVersion.major)
        this.baseVersion.minor = parseInt(this.baseVersion.minor)
        this.baseVersion.patch = parseInt(this.baseVersion.patch)
        this.baseVersion.pre = undefined === this.baseVersion.pre ? false : this.baseVersion.pre
        this.baseVersion.pre_count = undefined === this.baseVersion.pre_count ? false : this.baseVersion.pre_count
    }

    getNextVersion() {
        return this.nextVersion
    }

    getNextVersionString() {
        if (undefined !== this.versionString) {
            return this.versionString
        }

        this.versionString = `${this.nextVersion.major}.${this.nextVersion.minor}.${this.nextVersion.patch}`

        if (this.preRelease && this.nextVersion.pre && this.nextVersion.pre_count) {
            this.versionString += `-${this.nextVersion.pre}.${this.nextVersion.pre_count}`
        }

        return this.versionString;
    }

    getLatestMinor() {
        if (this.nextVersion.patch === 0) {
            return this.getNextVersionString();
        }

        const latestMinor = {...this.nextVersion}
        latestMinor.patch = 0

        return `${this.nextVersion.major}.${this.nextVersion.minor}.${this.nextVersion.patch}`
    }

    setupNextVersion() {
        this.nextVersion = { ...this.baseVersion }

        // we're on a pre-release and creating a pre-release
        if (this.preRelease && this.baseVersion.pre) {
            return this.createPreReleaseFromPreRelease()
        }

        // we're on a pre-release and creating a proper release
        if (!this.preRelease && this.baseVersion.pre) {
            return this.createReleaseFromPreRelease()
        }

        // we're on a release and creating a pre-release.
        if (this.preRelease) {
            this.incrementVersion();
            this.nextVersion.pre       = this.preRelease;
            this.nextVersion.pre_count = 1;

            return
        }

        // we're on a release and creating a release.
        this.incrementVersion()
    }

    incrementVersion() {
        this.nextVersion[this.increment] = this.nextVersion[this.increment] + 1
        if (this.increment !== 'patch') {
            this.nextVersion.patch = 0
            if (this.increment !== 'minor') {
                this.nextVersion.minor = 0
            }
        }
    }

    createPreReleaseFromPreRelease() {
        let increment = 'patch'
        if (this.baseVersion.patch === 0) {
            increment = this.baseVersion.minor ? 'major' : 'minor'
        }

        if (this.increment !== increment) {
            this.incrementVersion()
        }

        if (this.baseVersion.pre === this.preRelease) {
            this.nextVersion.pre_count = this.baseVersion.pre_count
                ? 2
                : this.baseVersion.pre_count + 1
        } else {
            this.nextVersion.pre       = this.preRelease
            this.nextVersion.pre_count = 1
        }

        this.checkPreReleaseLogic()
    }

    createReleaseFromPreRelease() {
        // we're on a pre-release and creating a release.
        if (
            (this.increment === 'patch' && this.baseVersion.patch === 0)
            || (this.increment === 'minor' && this.baseVersion.patch !== 0)
        ) {
            this.incrementVersion();
        } else if (
            this.increment === 'major'
            && (this.baseVersion.minor !== 0 || this.baseVersion.patch !== 0)
        ) {
            this.nextVersion.patch = 0;
            this.incrementVersion();
        }

        this.nextVersion.pre = false
        this.nextVersion.pre_count = false
    }

    /**
     * we can't create pre-releases from existing pre-releases, unless they haven't changed the version number.
     */
    checkPreReleaseLogic() {
        if (
            isset(this.baseVersion.pre)
            && (
                this.nextVersion[this.increment] !== this.baseVersion[this.increment]
                || this.nextVersion[this.increment] === 0
            )
        ) {
            console.log(`${logSymbols.error} ${chalk.bold.red(`Failed!`)} We can't create a release based on a non-existent version.`)
            throw new Error('failed')
        }
    }
}

/**
 * Execute routine
 */
export default function getSemVer(next) {
    heading('Calculating next version')

    write('Fetching latest version from github....')
    getLatestTag().then((baseVersion) => {
        onSameLine(`${logSymbols.success} Latest version on Github: ${baseVersion}`)

        try {
            const { version = 'patch', preRelease = false } = pluginData.answers
            const semver = new SemVer(baseVersion, version, preRelease)
            pluginData.semver = semver

            console.log( `${logSymbols.success} Next version: v${semver.getNextVersionString()}`)
            next()
        }
        catch (err) {
            return next(true)
        }
    })
}
