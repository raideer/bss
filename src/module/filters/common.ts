// Common functionality between background and content script

import { take, uniq } from 'lodash-es'
import { FilterPreset } from './types'
import localStorage from 'core/module/global-state/local-storage'

// Settings
export const SETTING_NOTIFICATIONS_ENABLED = 'notifications-enabled'
export const SETTING_NOTIFICATION_INTERVAL = 'notification-interval'
export const SETTING_ENABLED = 'memory-enabled'

// Storage
export const STORAGE_MEMORY = 'presets'

// Service worker
export const SW_FILTERS_PROCESSED = 'filters-processed'
export const SW_FILTERS_NEW = 'filters-new'
export const SW_MAX_SCAN_PAGES = 5

/**
 * returns list of listing IDs that we have already looked at
 */
export const fetchProcessedListings = async (preset: FilterPreset) => {
  const data = await localStorage.getItem(`${SW_FILTERS_PROCESSED}/${preset.id}`)

  if (!data) {
    return []
  }

  return data as string[]
}

/**
 * save list of listing IDs that we have already looked at
 */
export const saveProcessedListings = async (preset: FilterPreset, ids: string[]) => {
  await localStorage.setItem(`${SW_FILTERS_PROCESSED}/${preset.id}`, take(uniq(ids), 500))
}

/**
 * returns list of listing IDs that the user has not seen yet
 */
export const fetchUnseenListings = async (preset: FilterPreset) => {
  const data = await localStorage.getItem(`${SW_FILTERS_NEW}/${preset.id}`)

  if (!data) {
    return []
  }

  return data as string[]
}
/**
 * save list of listing IDs that the user has not seen yet
 */
export const saveUnseenListings = async (preset: FilterPreset, ids: string[]) => {
  await localStorage.setItem(`${SW_FILTERS_NEW}/${preset.id}`, take(uniq(ids), 500))
}
