import { error } from "./logger"

export function getPageInfo() {
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
