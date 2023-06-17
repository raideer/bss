import { CallbackFunction, whenLoaded } from 'util/lifecycle'
import fetchHtml from 'util/fetch-html'

import { dom, isElementInViewport } from 'util/dom'
import { getItem, registerSetting } from 'module/settings/storage'
import { timeout } from 'util/async'
import { AdType, getPageInfo } from 'util/page-info'
import { SettingCategory, SettingValueType } from 'module/settings/types'

let loading = false

registerSetting({
  id: 'infinite-load-enabled',
  type: SettingValueType.Checkbox,
  defaultValue: 'true',
  menu: SettingCategory.AdList,
  title: 'Automātiska sludinājumu ielāde',
  description: 'Automātiski ielādē un attēlo nākamās lapas sludinājumus'
})

const loadedListeners: CallbackFunction[] = []

export function whenNextPageLoaded (callback: CallbackFunction) {
  loadedListeners.push(callback)
}

function showLoader () {
  loading = true
  const loader = dom('div', { class: 'bss-loader', 'data-loader': 'infiniteload' }, dom('div'), dom('div'), dom('div'))
  document.querySelector('button.navia')?.closest('div')?.insertAdjacentElement('beforebegin', loader)
}

function hideLoader () {
  document.querySelector('.bss-loader[data-loader="infiniteload"]')?.remove()
  loading = false
}

async function loadNextPage () {
  const pageInfo = getPageInfo()
  const lastLink = document.querySelector('a[rel="next"].navi:last-child') as HTMLAnchorElement
  const activeLink = document.querySelector('button.navia') as HTMLButtonElement

  if (!activeLink || !activeLink.nextElementSibling) return

  const nextLink = activeLink.nextElementSibling

  if (!loading && nextLink?.tagName === 'A' && !nextLink.isEqualNode(lastLink)) {
    showLoader()

    await timeout(1000);

    const nextLinkHref = (nextLink as HTMLAnchorElement).href;
    const html = await fetchHtml(nextLinkHref) as Document
    // Select and place ads
    if (pageInfo.adType === AdType.AD_TYPE_GALLERY) {
      const items = html.querySelector('.ads_album_td')?.closest('tbody')?.querySelectorAll(':scope > tr')
      const tbody = document.querySelector('.ads_album_td')?.closest('tbody')

      if (tbody && items) {
        items.forEach(item => {
          tbody.appendChild(item)
        })
      }
    } else {
      const items = html.querySelectorAll('[id^=tr_]')
      items.forEach(item => {
        document.querySelector('[id^=tr_]:last-of-type')?.insertAdjacentElement('afterend', item)
      })
    }

    // Update pagination
    const newPagination = html.querySelector('button.navia')?.closest('div')
    if (newPagination) {
      document.querySelector('button.navia')?.closest('div')?.replaceWith(newPagination)
    }

    // Update url
    if (window.history) {
      window.history.pushState(null, '', nextLinkHref);
    }

    loadedListeners.forEach(listener => listener())

    hideLoader()
  }
}

whenLoaded(() => {
  if (getItem('infinite-load-enabled') !== 'true') return

  window.addEventListener('scroll', () => {
    const menuButtonEl = document.querySelector('button.navia')
    if (!loading && menuButtonEl && isElementInViewport(menuButtonEl)) {
      loadNextPage()
    }
  })
})
