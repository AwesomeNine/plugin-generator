/**
 * External dependencies
 */
import inquirer from 'inquirer'

/**
 * Internal Dependencies
 */
import { pluginData } from '../release.js'

/**
 * Execute routine
 */
export default ( next ) => {
    const questions = [
        {
            type: 'list',
            name: 'version',
            message: 'Select version type',
            default: 'patch',
            choices: [
                { value: 'major', name: 'Major' },
                { value: 'minor', name: 'Minor' },
                { value: 'patch', name: 'Patch' },
            ]
        },
        {
            type: 'confirm',
            name: 'preRelease',
            message: 'Is this a Pre-Release',
            default: false
        },
        {
            type: 'list',
            name: 'preVersion',
            message: 'Select pre-releae version type',
            default: 'patch',
            choices: [
                { value: 'alpha', name: 'Alpha' },
                { value: 'beta', name: 'Beta' },
                { value: 'rc', name: 'Release Candidate' },
            ],
            when: (ans) => ans.preRelease
        },
    ]

    inquirer.prompt( questions )
        .then( ( answers ) => {

            if (answers.preRelease) {
                answers.preRelease = answers.preVersion
                delete answers.preVersion
            }

            pluginData.answers = answers

            next()
        } )
}
