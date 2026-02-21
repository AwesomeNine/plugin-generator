/**
 * External Dependencies
 */
import fs from 'fs'
import path from 'path'
import logSymbols from 'log-symbols'
import { forEach, waterfall } from 'async'

/**
 * Internal Dependencies
 */
import { pluginData } from '../release.js';
import { heading, execCommand, onSameLine, updateFileContent, write } from "../../utilities/index.js"

const LOCALES_CHANGELOG = {
    updated: {
        file: 'improvement-102',
        message: 'update %s translations'
    },
    added: {
        file: 'improvement-101',
        message: 'add %s translations'
    }
}

/**
 * Join list of languages
 *
 * @param {Array} list List of languages downloaded
 *
 * @returns {Array}
 */
function naturalLanguageJoin(list) {
    const last = list.pop()

    if ( list.length > 0 ) {
        return `${list.join(', ')} and ${last}`
    }

    return last
}

/**
 * Loop through downloaded locales and categorize them as added or updated
 *
 * @param {Array} locales Locales downloaded from GlotPress
 * @param {Array} files   Files currently in branch
 *
 * @returns {Array}
 */
function loopLocales( locales, files ) {
    const changes = { updated: [], added: [] }
    const localeFiles = Object.keys(locales)

    localeFiles.map( (locale) => {
        const action = files.includes(locale) ? 'updated' : 'added'
        changes[ action ].push(locales[ locale ])
    })

    changes.added = [... new Set(changes.added)].sort()
    changes.updated = [... new Set(changes.updated)].sort()

    return changes
}

/**
 * Write changes to file in .changelog folder
 *
 * @param {String} type    Type of log
 * @param {Array}  changes List of changes
 *
 * @returns {void}
 */
function writeLocalesChangelog(type, changes) {
    if ( changes.length < 1 ) {
        return
    }

    const message = LOCALES_CHANGELOG[type].message.replace('%s', naturalLanguageJoin(changes))

    if (!fs.existsSync('./.changelog')) {
        fs.mkdirSync('./.changelog');
    }

    fs.writeFileSync(
        `./.changelog/${LOCALES_CHANGELOG[type].file}`,
        message
    )
}

/**
 * Update changelog for locales
 */
function updateLocalesChangelog(next) {
    const { glotpress = {} } = pluginData

    write('Generating translations changelog...')

    execCommand('git ls-files ' + glotpress.destination, function(result) {
        const files = result.split('\n').slice(0,-1)
        const changes = loopLocales(pluginData.locales, files)

        writeLocalesChangelog('added', changes.added)
        writeLocalesChangelog('updated', changes.updated)

        onSameLine( `${logSymbols.success} Translations changelog added` )
        next()
    })
}

/**
 * Generate changelog entries from .changelog files
 */
function generateEntries(next) {
    write('Generating changelog entries...')

    const changes = {
        fix: [],
        feature: [],
        improvement: [],
    }

    const labels = {
        fix: 'Fix',
        feature: 'Feature',
        improvement: 'Improvement',
    }
    const allowed = Object.keys(labels)

    fs.readdir('./.changelog', (err, files) => {
        if ( null !== err ) {
            onSameLine(`${logSymbols.error} Unable to find .changelog directory`)
            return next(true)
        }

        forEach(files.sort(), (fileName, nextFile) => {
            const parts = fileName.split('-')

            if (allowed.includes(parts[0])) {
                const content = fs.readFileSync(`./.changelog/${fileName}`)

                changes[ parts[0] ].push(
                    `- ${labels[parts[0]]}: ${content.toString().trim()}`
                )
            }

            nextFile()
        }, () => {
            const currentDate = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            pluginData.changelogChanges = [
                ...changes['feature'],
                ...changes['improvement'],
                ...changes['fix'],
            ]

            pluginData.changelogChanges = pluginData.changelogChanges.length > 0
                ? [
                    `= ${pluginData.semver.getNextVersionString()} (${currentDate.toLocaleDateString('en', options)}) =`,
                    '',
                    ...pluginData.changelogChanges
                ] : false

            onSameLine(`${logSymbols.success} Changelog entries generated successfully`)
            next()
        })
    })
}

function writeToChangelog(next) {
    updateFileContent(
        './changelog.txt',
        {
            updating: 'Updating changelog file...',
            failed: 'Failed to update changelog file',
            updated: 'Changelog file updated'
        },
        next,
        (content) => {
            if(false !== pluginData.changelogChanges && !content.includes(`= ${pluginData.semver.getNextVersionString()}`)) {
                content = content
                    .replace(
                        '== Changelog ==',
                        [
                            '== Changelog ==',
                            '',
                            ...pluginData.changelogChanges
                        ].join('\n')
                    )

                pluginData.commitMessages.push('add changelog to changelog.txt')
            }

            return content
        }
    )
}

function writeToReadme(next) {
    updateFileContent(
        './readme.txt',
        {
            updating: 'Updating readme file...',
            failed: 'Failed to update readme file',
            updated: 'Readme file updated'
        },
        next,
        (content) => {
            if(false !== pluginData.changelogChanges && !content.includes(`= ${pluginData.semver.getNextVersionString()}`)) {
                content = content
                    .replace(
                        '== Changelog ==',
                        [
                            '== Changelog ==',
                            '',
                            ...pluginData.changelogChanges
                        ].join('\n')
                    )

                pluginData.commitMessages.push('add changelog to readme.txt')
            }

            return content
        }
    )
}

function cleanChangelogDirectory(next) {
    process.stderr.write('Cleaning changelog directory....')

    const folder = './.changelog'

    if (fs.existsSync(folder)) {
        fs.rmSync(folder, { recursive: true, force: true })
        fs.mkdirSync(folder)
        fs.writeFileSync(`${folder}/.gitignore`, '')
    }

    onSameLine(`${logSymbols.success} Changelog directory cleaned`)
    next()
}

/**
 * Execute routine
 */
export default function updateChangelog(next) {
    heading('Creating changelog')

    const flow = [
        updateLocalesChangelog,
        generateEntries
    ]

    if (!pluginData.semver.preRelease) {
        flow.push(writeToChangelog)
        flow.push(writeToReadme)
        flow.push(cleanChangelogDirectory)
    }

    waterfall( flow, () => next() )
}
