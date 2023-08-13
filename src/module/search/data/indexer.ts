import { getLocationInfo } from 'util/page-info'
import fetchHtml from 'util/fetch-html'
import { log } from 'util/logger'
import { SearchCategory } from '../types'
import defaultIndex from './defaultIndex.json'
import { trimEnd } from 'lodash-es'

const INDEX_LIFETIME = 1000 * 60 * 60 * 24 * 30

const trimUrl = (url: string) => {
  return trimEnd(url.slice(3), '/')
}

const indexChildCategories = async (url: string): Promise<SearchCategory[]> => {
  const html = await fetchHtml(url)
  const elements = html.querySelectorAll('.category a')

  if (!elements) {
    return []
  }

  const promises = Array.from(elements).map(async (categoryLink: Element) => {
    const href = categoryLink.getAttribute('href')!

    const category = {
      name: categoryLink.textContent!,
      url: trimUrl(href!),
      children: []
    }

    return category
  })

  return Promise.all(promises)
}

const getSubcategories = async (categoryLink: Element): Promise<SearchCategory[]> => {
  const elements = categoryLink.closest('div[id^="dv_"]')?.querySelectorAll('a[id^="mtd_"]')

  if (!elements) {
    return []
  }

  const promises = Array.from(elements).map(async (subcategoryLink: Element) => {
    const href = subcategoryLink.getAttribute('href')!

    const category = {
      name: subcategoryLink.textContent!,
      url: trimUrl(href!),
      children: await indexChildCategories(href)
    }

    return category
  })

  return Promise.all(promises)
}

const getMainCategories = (html: Document): Promise<SearchCategory[]> => {
  const elements = html.querySelectorAll('#main_img_div .a1')

  const promises = Array.from(elements).map(async (categoryLink: Element) => {
    const category = {
      name: categoryLink.textContent!,
      url: trimUrl(categoryLink.getAttribute('href')!),
      children: await getSubcategories(categoryLink)
    }

    return category
  })

  return Promise.all(promises)
}

const saveIndex = (categories: SearchCategory[]) => {
  const json = JSON.stringify(categories)
  localStorage.setItem('bss_search_index', json)
  localStorage.setItem('bss_search_index_timestamp', `${+new Date()}`)
}

const indexHomepage = async () => {
  const locationInfo = getLocationInfo()

  if (!locationInfo) {
    return
  }

  const homeUrl = `${locationInfo.baseUrl}/${locationInfo.lang}`

  const html = await fetchHtml(homeUrl)
  const categories = await getMainCategories(html)

  saveIndex(categories)
}

export const indexCategories = async () => {
  if (localStorage.getItem('bss_search_index')) {
    const timestamp = localStorage.getItem('bss_search_index_timestamp')!

    if (+new Date() - +timestamp < INDEX_LIFETIME) {
      log(`Index is still valid [ts ${timestamp}]`)
      return
    }

    log('Index is outdated')
  }

  log('Indexing categories...')

  await indexHomepage()

  log('Indexing complete')
}

export const loadDefaultIndex = (force = false) => {
  if (!force && localStorage.getItem('bss_search_index')) {
    return
  }

  saveIndex(defaultIndex)
}
