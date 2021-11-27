import { error } from "./logger"

export enum AdType {
  AD_TYPE_TABLE,
  AD_TYPE_GALLERY
}

export interface PageInfo {
  adType: AdType
}

export function getPageInfo() {
  const paths = getLocationPath()

  const pageInfo: PageInfo = {
    adType: AdType.AD_TYPE_TABLE
  }

  if (paths.indexOf('photo') >= 0) {
    pageInfo.adType = AdType.AD_TYPE_GALLERY
  }

  return pageInfo
}

export function getLocationPath() {
  const currentUrl = window.location.pathname
  const match = currentUrl.match(/(\/msg)?((\/lv|\/ru|\/en))?\/(?<path>[a-zA-Z0-9-\/]+)+/)

  if (!match) {
    error('Could not match pathname regex')
    return []
  }

  const path = match.groups?.path
  if (path) {
    const currentPath = path.split('/').filter(p => p)

    return currentPath
  }

  return []
}
