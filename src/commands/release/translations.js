/**
 * External Dependencies
 */
import logSymbols from 'log-symbols'

/**
 * Internal Dependencies
 */
import { pluginData } from '../release.js'
import { heading, execCommand, getSetting } from "../../utilities/index.js"

/**
 * Execute routine to download translations from GlotPress
 */
export default function updateTranslations( next ) {
    heading('Downloading translations from glotpress')

    const glotpress = getSetting('wp.glotpress')

    if (!glotpress) {
        console.log( logSymbols.warning + ' No glotpress project found' )
        next()
        return;
    }

    execCommand( 'npx wp-advads translations', function(locales) {
        locales = locales.split('\n').slice(4).slice(0,-1)
        console.log( logSymbols.success + ` Downloaded ${locales.length} files successfully` )

        if (locales.length > 0) {
            pluginData.commitMessages.push('add: Download translation from GlotPress')
        }

        const newLocales = {}
        locales.map((locale) => {
            const data = locale.split('=')
            newLocales[ data[0] ] = data[1]
        })

        pluginData.locales = newLocales

        next()
    })
}
