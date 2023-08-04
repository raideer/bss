import browser from 'webextension-polyfill'
import { log } from 'util/logger'
import * as cheerio from 'cheerio'
import { difference, take } from 'lodash-es'

const STORAGE_ENABLED = 'memory-notifications-enabled'
const STORAGE_FILTERS = 'filters'
const STORAGE_FILTERS_PROCESSED = 'filters-processed'
const STORAGE_FILTERS_NEW = 'filters-new'

interface Filter {
  name: string
  data: any
  formData: string
  id: string
  notifications: boolean
  path: string
}

const fetchProcessedListings = async (key: string) => {
  const data = await browser.storage.sync.get([key])

  if (!data[key]) {
    return []
  }

  return data[key] as string[]
}

const getPageListings = async (filter: Filter, page = 1) => {
  let filterUrl = `https://www.ss.com${filter.path}`

  if (page > 1) {
    filterUrl = `${filterUrl}page${page}.html`
  }

  const response = await fetch(filterUrl, {
    method: 'POST',
    body: filter.formData
  })

  const $ = cheerio.load(await response.text())

  const items = $('[id^=tr_]:not([id^=tr_bnr])')

  const ids = []
  for (const item of items) {
    ids.push(item.attribs.id)
  }

  return ids
}

const getListingDifference = async (filter: Filter, processed: string[], page = 1): Promise<string[]> => {
  const ids = await getPageListings(filter, page)

  const diff = difference(ids, processed)

  // All new
  if (diff.length > 0 && diff.length === ids.length) {
    const nextDiff = await getListingDifference(filter, processed, page + 1)
    log('Fetching next page')
    return [...diff, ...nextDiff]
  }

  return diff
}

const processFilter = async (filter: Filter) => {
  log('Processing filter: ' + filter.id)

  const key = `${STORAGE_FILTERS_PROCESSED}/${filter.id}`
  const processed = await fetchProcessedListings(key)

  // First time
  if (processed.length === 0) {
    const ids = await getPageListings(filter)

    await browser.storage.sync.set({
      [key]: ids
    })

    return
  }

  // const diff = difference(ids, processed)
  const diff = await getListingDifference(filter, processed)

  if (diff.length === 0) {
    // No new listings
    return
  }

  browser.notifications.create(`https://www.ss.com${filter.path}?bss-filter=${encodeURIComponent(filter.id)}`, {
    type: 'basic',
    iconUrl: 'assets/icons/bss128.png',
    title: `[BSS] ${diff.length} jauni sludinājumi`,
    message: `Atrasti ${diff.length} jauni sludinājumi, kas atbilst filtram "${filter.name}"`
  })

  await browser.storage.sync.set({
    [key]: take([...diff, ...processed], 500),
    [STORAGE_FILTERS_NEW]: diff
  })

  log(`Found ${diff.length} new listings for filter '${filter.id}'`)
}

export const notifyNewListings = async () => {
  log('Checking for new listings')

  const filters = await browser.storage.sync.get([STORAGE_ENABLED, STORAGE_FILTERS])

  if (!filters[STORAGE_ENABLED] || !filters[STORAGE_FILTERS]) {
    return
  }

  const data = filters[STORAGE_FILTERS]
  const filtersWithNotifications = []

  for (const pageId in data) {
    for (const name in data[pageId]) {
      if (data[pageId][name].notifications) {
        filtersWithNotifications.push({
          ...data[pageId][name],
          name
        })
      }
    }
  }

  if (!filtersWithNotifications.length) {
    return
  }

  await Promise.all(filtersWithNotifications.map(filter => processFilter(filter)))
}

browser.notifications.onClicked.addListener(function (notificationId) {
  browser.tabs.create({ url: notificationId })
})
