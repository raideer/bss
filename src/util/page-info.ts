import { error } from "./logger"

export function getPageInfo() {
  const currentUrl = window.location.pathname
  const match = currentUrl.match(/(\/msg)?((\/lv|\/ru|\/en))?\/(?<path>[a-zA-Z0-9-\/]+)+/)

  if (!match) {
    return error('Could not match pathname regex')
  }

  const path = match.groups?.path
  if (path) {
    const currentPath = path.split('/').filter(p => p)
  }
}
