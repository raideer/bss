import { CallbackFunction, whenLoaded } from 'util/lifecycle'
import fetchHtml from 'util/fetch-html'

import { dom, isElementInViewport } from 'util/dom'
import { getCachedItem, registerSetting, SettingCategory, SettingValueType } from 'module/settings/storage'
import { timeout } from 'util/timeout'

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
  const loader = dom('div', { class: 'ssp-loader', 'data-loader': 'infiniteload' }, dom('div'), dom('div'), dom('div'))
  document.querySelector('button.navia')?.closest('table')?.insertAdjacentElement('beforebegin', loader)
}

function hideLoader () {
  loading = false
  document.querySelector('.ssp-loader[data-loader="infiniteload"]')?.remove()
}

async function loadNextPage () {
  const lastLink = document.querySelector('a[rel="next"].navi:last-child') as HTMLAnchorElement
  const activeLink = document.querySelector('button.navia') as HTMLButtonElement

  if (!activeLink || !activeLink.nextElementSibling) return

  const nextLink = activeLink.nextElementSibling

  if (!loading && nextLink?.tagName === 'A' && !nextLink.isEqualNode(lastLink)) {
    showLoader()

    await timeout(1000);

    const html = await fetchHtml((nextLink as HTMLAnchorElement).href)
    // Select and place ads
    const items = html.querySelectorAll('tr[id^=tr_]')

    items.forEach(item => {
      document.querySelector('tr[id^=tr_]:last-of-type')?.insertAdjacentElement('afterend', item)
    })

    // Update pagination
    const newPagination = html.querySelector('button.navia')?.closest('table')
    if (newPagination) {
      document.querySelector('button.navia')?.closest('table')?.replaceWith(newPagination)
    }

    loadedListeners.forEach(listener => listener())

    setTimeout(() => {
      hideLoader()
    }, 1000)
  }
}

whenLoaded(() => {
  if (getCachedItem('infinite-load-enabled') === 'false') return

  window.addEventListener('scroll', () => {
    const menuButtonEl = document.querySelector('button.navia')
    if (!loading && menuButtonEl && isElementInViewport(menuButtonEl)) {
      loadNextPage()
    }
  })
})