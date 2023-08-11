import { memoize, trimStart } from 'lodash-es'
import { error } from './logger'

export enum AdType {
  AD_TYPE_TABLE = 'table',
  AD_TYPE_GALLERY = 'gallery'
}

export interface ListingPageInfo {
  adType: AdType
}

export const isListingPage = memoize(() => {
  return !!document.querySelector('[id^=tr_')
})

export const getListingPageInfo = memoize(() => {
  const paths = getLocationPath()

  const pageInfo: ListingPageInfo = {
    adType: AdType.AD_TYPE_TABLE
  }

  if (paths.indexOf('photo') >= 0) {
    pageInfo.adType = AdType.AD_TYPE_GALLERY
  }

  return pageInfo
})

export const getLocationInfo = memoize((path?: string) => {
  const location = window.location

  const currentPath = path || window.location.pathname
  const match = currentPath.match(/(\/msg)?((?<lang>\/lv|\/ru|\/en))?\/(?<path>[a-zA-Z0-9-/]*)+/)

  if (!match) {
    return null
  }

  return {
    path: match.groups?.path,
    lang: trimStart(match.groups?.lang, '/'),
    baseUrl: `${location.protocol}//${location.host}`
  }
})

export function getLocationPath (path?: string) {
  const info = getLocationInfo(path)

  if (!info) {
    error('Could not match pathname regex')
    return []
  }

  if (info.path) {
    const currentPath = info.path.split('/').filter(p => p)
    return currentPath
  }

  return []
}
