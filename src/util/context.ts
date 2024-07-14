import { first, memoize, trim } from 'lodash-es'
import { Lifecycle, lifecycleState } from './lifecycle'

export enum PageLocation {
  Home = 'home',
  Category = 'category',
  AdList = 'ad-list',
  Ad = 'ad',
  Unknown = 'unknown'
}

interface BasePageInfo {
  location: PageLocation
}

export interface AdListPageInfo {
  location: PageLocation.AdList
  listingType: 'table' | 'gallery'
}

type PageInfo = BasePageInfo | AdListPageInfo

export const getPageInfo = memoize((): PageInfo => {
  if (
    lifecycleState.status !== Lifecycle.End &&
    lifecycleState.status !== Lifecycle.Idle
  ) {
    throw new Error('Cannot get page info before page has loaded')
  }

  const url = trim(window.location.pathname, '/')
  const parts = url.split('/')
  const partsWithoutLocale = parts.filter((part) => {
    return ['en', 'lv', 'ru'].indexOf(part) === -1
  })

  const location = getLocation(partsWithoutLocale)

  if (location === PageLocation.AdList) {
    return {
      location,
      listingType: partsWithoutLocale.includes('photo') ? 'gallery' : 'table'
    }
  }

  return {
    location
  }
})

const getLocation = (parts: string[]): PageLocation => {
  if (first(parts) === 'msg') {
    return PageLocation.Ad
  }

  if (parts.length === 0) {
    return PageLocation.Home
  }

  if (document.querySelector('[id^=tr_]')) {
    return PageLocation.AdList
  }

  if (document.querySelector('[id^=sc_]')) {
    return PageLocation.Category
  }

  return PageLocation.Unknown
}
