import browser from 'webextension-polyfill'
import { log } from 'util/logger'
import * as cheerio from 'cheerio'
import { difference, take } from 'lodash-es'

const STORAGE_ENABLED = 'bss_memory-notifications-enabled'
const STORAGE_FILTERS = 'bss_filters'

const STORAGE_FILTERS_PROCESSED = 'filters-processed'

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

  return data[key]
}

const processFilter = async (filter: Filter) => {
  log('Processing filter: ' + filter.id)

  const filterUrl = `https://www.ss.com${filter.path}`

  const response = await fetch(`https://www.ss.com${filter.path}`, {
    method: 'POST',
    body: filter.formData
  })

  const $ = cheerio.load(await response.text())
  const key = `${STORAGE_FILTERS_PROCESSED}/${filter.id}`
  const processed = await fetchProcessedListings(key)

  const items = $('[id^=tr_]:not([id^=tr_bnr])')

  const ids = []
  for (const item of items) {
    ids.push(item.attribs.id)
  }

  // First time
  if (processed.length === 0) {
    await browser.storage.sync.set({
      [key]: ids
    })

    return
  }

  const diff = difference(ids, processed)

  if (diff.length === 0) {
    // No new listings
    return
  }

  browser.notifications.create(`${filterUrl}`, {
    type: 'basic',
    iconUrl: 'assets/icons/bss128.png',
    title: `[BSS] ${diff.length} jauni sludinājumi`,
    message: `Atrasti ${diff.length} jauni sludinājumi, kas atbilst filtram "${filter.name}"`
  })

  await browser.storage.sync.set({
    [key]: take([...diff, ...processed], 500)
  })
}

export const notifyNewListings = async () => {
  log('Notify new listings')

  const filters = await browser.storage.sync.get([STORAGE_ENABLED, STORAGE_FILTERS])

  if (filters[STORAGE_ENABLED] === 'false') {
    return
  }

  if (!filters[STORAGE_FILTERS]) {
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
