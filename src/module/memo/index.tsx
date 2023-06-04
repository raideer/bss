import { getItem, registerSetting, SettingCategory, SettingValueType } from 'module/settings/storage'
import { MemoButton } from './MemoButton'
import { addButton, beforeAddButtons } from 'core/module/button-container'
import fetchHtml from 'util/fetch-html'

export const SETTING_ENABLED = 'memo-button-enabled'

registerSetting({
  id: SETTING_ENABLED,
  type: SettingValueType.Checkbox,
  defaultValue: 'true',
  menu: SettingCategory.AdList,
  title: 'Memo poga',
  description: 'Pievieno sludinājumu Memo'
})

function parseId(trId: string) {
  const [, id] = trId.split('_');
  return id
}

export async function loadMemoItems() {
  return fetchHtml('/lv/favorites/', true)
  .then(html => {
    // Favorites page also shows viewed listings so we need to fetch the page
    // that only shows memos
    const memoLinkElement = html.querySelector('.filter_second_line_dv a[href*=favorites]')
    const memoLink = memoLinkElement?.getAttribute('href')

    return memoLink ? fetchHtml(memoLink, true) : null
  })
  .then(html => {
    if (!html) {
      return []
    }

    const items = html.querySelectorAll('[id^=tr_]')
    const ids: string[] = []

    items.forEach(item => {
      const id = item.getAttribute('id')
      if (id) {
        ids.push(parseId(id))
      }
    })

    return ids
  })
}

let currentMemoItems: string[] | null = null

beforeAddButtons(async () => {
  currentMemoItems = await loadMemoItems()
})

addButton((row: Element) => {
  if (getItem(SETTING_ENABLED) !== 'true') return

  const rowId = row.getAttribute('id');

  if (rowId && currentMemoItems) {
    const id = parseId(rowId)
    const isInMemo = currentMemoItems.indexOf(id) > -1
    return <MemoButton id={id} isInMemo={isInMemo} />
  }
})
