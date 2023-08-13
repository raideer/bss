import { PageLocation, getPageInfo } from 'util/context'
import { whenLoaded } from 'util/lifecycle'
import { HistoryItem } from './types'
import localStorage from 'core/module/global-state/local-storage'
import { HISTORY_SIZE, STORAGE_HISTORY } from './constants'
import { take, uniqBy } from 'lodash-es'
import { log } from 'util/logger'

export const addPageToHistory = async (item: HistoryItem) => {
  const currentHistory = (await localStorage.getItem(STORAGE_HISTORY) || []) as HistoryItem[]
  const newHistory = uniqBy([item, ...currentHistory], 'id')
  log('Adding page to history', item)
  await localStorage.setItem(STORAGE_HISTORY, take(newHistory, HISTORY_SIZE))
}

whenLoaded(() => {
  const pageInfo = getPageInfo()

  if (pageInfo.location === PageLocation.Ad) {
    const memoButton = document.querySelector('#add-to-favorites-lnk')
    const memoOnClick = memoButton?.getAttribute('onclick')
    const id = memoOnClick?.match(/'(\d+)'/)?.[1]
    const content = document.querySelector('#msg_div_msg')?.textContent

    if (!id || !content) {
      return
    }

    addPageToHistory({
      id,
      title: content.replace(/(\r\n|\n|\r)/gm, '').substring(0, 64),
      url: window.location.pathname
    })
  }
})
