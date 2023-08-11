import browser from 'webextension-polyfill'
import { log } from 'util/logger'
import * as cheerio from 'cheerio'
import { difference, take, uniq } from 'lodash-es'
import { getStorageItem } from 'core/module/global-state/storage.helper'
import { FilterPreset } from '../types'
import localStorage from 'core/module/global-state/local-storage'
import { SETTING_ENABLED, SETTING_NOTIFICATION_INTERVAL, SW_FILTERS_NEW, SW_FILTERS_PROCESSED, SW_MAX_SCAN_PAGES } from '../constants'
import { getSettingFromStorage } from 'core/module/settings/settings.helper'

getSettingFromStorage(SETTING_NOTIFICATION_INTERVAL).then(value => {
  const periodInMinutes = value ? Number(value) : 30
  log('Setting notification interval to', periodInMinutes, 'minutes')
  browser.alarms.create('notify-new-listings', {
    periodInMinutes
  })
})

export const notifyNewListings = async () => {
  log('Checking for new listings')

  const enabled = await getSettingFromStorage(SETTING_ENABLED)

  if (!enabled) {
    log('Notifications disabled')
    return
  }

  const presets = await getStorageItem('local', 'presets') as FilterPreset[]

  if (!presets) {
    log('No presets')
    return
  }

  // const data = filters[STORAGE_FILTERS]
  const presetsWithNotifications = presets.filter(preset => {
    return preset.notifications === true
  })

  if (!presetsWithNotifications.length) {
    log('No presets with notifications enabled')
    return
  }

  await Promise.all(presetsWithNotifications.map(preset => processPreset(preset)))
}

const processPreset = async (preset: FilterPreset) => {
  log('Processing preset:', preset.id)

  const key = `${SW_FILTERS_PROCESSED}/${preset.id}`
  const processed = await fetchProcessedListings(key)

  // First time
  if (processed.length === 0) {
    const ids = await getPageListings(preset)

    await localStorage.setItem(key, ids)

    log('Processed first scan for', preset.id)
    return
  }

  // const diff = difference(ids, processed)
  const diff = await getListingDifference(preset, processed)

  if (diff.length === 0) {
    // No new listings
    log('No new listings found', preset.id)
    return
  }

  const limitReached = diff.length >= 30 * SW_MAX_SCAN_PAGES

  browser.notifications.create(`https://www.ss.com${preset.path}?bss-filter=${preset.id}`, {
    type: 'basic',
    iconUrl: 'assets/icons/bss128.png',
    title: `[BSS] ${diff.length} jauni sludinājumi`,
    message: `Atrasti ${diff.length}${limitReached ? '+' : ''} jauni sludinājumi, kas atbilst filtram "${preset.name}"`
  })

  // Keep track of listings we have processed
  await localStorage.setItem(key, take([...diff, ...processed], 500))

  // This tacks listings that the user has not seen yet
  const newListingsKey = `${SW_FILTERS_NEW}/${preset.id}`
  const newListings = await localStorage.getItem(newListingsKey) || []
  await localStorage.setItem(newListingsKey, uniq([...diff, ...newListings]))

  log(`Found ${diff.length} new listings for preset '${preset.id}'`)
}

/**
 * returns list of listing IDs that we have already looked at
 */
const fetchProcessedListings = async (key: string) => {
  const data = await localStorage.getItem(key)

  if (!data) {
    return []
  }

  return data as string[]
}

const getPageListings = async (preset: FilterPreset, page = 1) => {
  let filterUrl = `https://www.ss.com${preset.path}`

  if (page > 1) {
    filterUrl = `${filterUrl}page${page}.html`
  }

  const response = await fetch(filterUrl, {
    method: 'POST',
    body: new URLSearchParams(preset.params)
  })

  const $ = cheerio.load(await response.text())

  const items = $('[id^=tr_]:not([id^=tr_bnr])')

  const ids = []
  for (const item of items) {
    ids.push(item.attribs.id)
  }

  return ids
}

const getListingDifference = async (preset: FilterPreset, processed: string[], page = 1): Promise<string[]> => {
  const ids = await getPageListings(preset, page)

  const diff = difference(ids, processed)

  log('Diff for', preset.id, ':', diff.length, 'new listings. Page', page)

  // All new
  if (diff.length > 0 && diff.length === ids.length && page < SW_MAX_SCAN_PAGES) {
    const nextDiff = await getListingDifference(preset, processed, page + 1)
    log('Fetching next page')
    return [...diff, ...nextDiff]
  }

  return diff
}

// Open tab when notification is clicked
browser.notifications.onClicked.addListener(function (notificationId) {
  browser.tabs.create({ url: notificationId })
})
