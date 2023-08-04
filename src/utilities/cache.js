/**
 * External dependencies
 */
import flatCache from 'flat-cache'

/**
 * Internal Dependencies
 */
import { getRootFolder } from './folder.js'

export const CACHE_FILE = 'wp-awesome9-scaffolding'

export function getCacheStore() {
    return flatCache.load( CACHE_FILE, getRootFolder() )
}

export function getSettings() {
    const cache = getCacheStore()
    let saved = cache.all()
    saved = saved ? saved.answers : {}

    return saved
}
