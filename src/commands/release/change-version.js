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
import { pluginData } from '../release.js'
import { getSetting, heading, onSameLine, saveConfig, updateFileContent, write } from "../../utilities/index.js"

/**
 * Update version in readme.txt file
 *
 * @example Stable tag: {version}
 */
function updateReadme(next) {
    updateFileContent(
        './readme.txt',
        {
            updating: 'Updating readme file',
            failed: 'Failed to update Readme file',
            updated: 'Readme file updated successfully',
        },
        next,
        (content) => {
            let regex = new RegExp('^(?<prefix>Stable tag:\\h*)(?<version>(.*))$', 'mi')
            regex = regex.exec(content)

            if (null !== regex) {
                regex = regex.groups
                content = content.replace(`${regex.prefix}${regex.version}`, `${regex.prefix} ${pluginData.semver.getNextVersionString()}`)
                pluginData.commitMessages.push('update version in readme.txt')
            }

            return content
        }
    )
}

/**
 * Update version in plugin PHP files at root level
 *
 * @example * Version: {version}
 * @example * define( 'AA_VERSION', '{version}' );
 */
function updatePluginFiles(next) {
    write( 'Updating plugin files' )

    fs.readdir('./', (err, files) => {
        if ( null !== err ) {
            onSameLine(`${logSymbols.error} Unable to fetch PHP files`)
            return next(true)
        }

        const phpFiles = files.filter(file => {
            return path.extname(file).toLowerCase() === '.php' && file.toLowerCase() !== 'index.php'
        });

        if ( phpFiles.length < 1 ) {
            onSameLine(`${logSymbols.error} No PHP files found`)
            return next(true)
        }

        forEach(phpFiles, (fileName, nextFile) => {
            updateFileContent(
                fileName,
                {
                    updating: `Updating ${fileName}`,
                    failed: `Failed to update ${fileName}`,
                    updated: `${fileName} updated successfully`,
                },
                nextFile,
                (content) => {
                    let update = false
                    const version = pluginData.semver.getNextVersionString()
                    let versionRe = new RegExp('^(?<prefix>(?:[ \\t]*<\\?php)?[ \\t\\/*#@]*Version: +)(?<version>.*)$', 'mi')
                    let constantRe = new RegExp('^(?<opening>(?:[ \\t])?define.*[\\\'"].*_VERSION[\\\'"],.*[\\\'"])(?<version>.*)(?<closing>[\\\'"].*)$', 'mi')

                    versionRe = versionRe.exec(content)
                    if (null !== versionRe) {
                        update = true
                        versionRe = versionRe.groups
                        content = content.replace(`${versionRe.prefix}${versionRe.version}`, `${versionRe.prefix}${version}`)
                    }

                    constantRe = constantRe.exec(content)
                    if (null !== constantRe) {
                        update = true
                        constantRe = constantRe.groups
                        content = content.replace(
                            `${constantRe.opening}${constantRe.version}${constantRe.closing}`,
                            `${constantRe.opening}${version}${constantRe.closing}`,
                        )
                    }

                    if(update) {
                        pluginData.commitMessages.push('update version in ' + fileName)
                    }

                    return content
                }
            )
        }, () => next())
    })
}

/**
 * Update version in config file
 */
function updateConfigFile(next) {
    const settings = getSetting()
    settings.wp.version = pluginData.semver.getNextVersionString()
    saveConfig(settings)
    onSameLine(`${logSymbols.success} Version updated in config file`)
    next()
}

/**
 * Execute routine
 */
export default function updateVersionNumber(next) {
    heading('Updating files for new version')

    const flow = []

    if (!pluginData.semver.preRelease) {
        flow.push(updateReadme)
        flow.push(updateConfigFile)
    }

    flow.push(updatePluginFiles)

    waterfall(
        flow,
        () => next()
    )
}
