import { addButton } from 'core/module/button-container'
import { SettingCategory, SettingValueType } from 'core/module/settings/types'
import { parseId } from './common'
import { whenLoaded } from 'util/lifecycle'
import store from 'core/module/global-state/store'
import { fetchMemoItems } from './state/memo.slice'
import { renderReact } from 'util/react'
import { MemoButton } from './components/MemoButton'
import { MemoCounter } from './components/MemoCounter'
import { registerSetting } from 'core/module/settings/state/settings.thunk'
import { getSetting } from 'core/module/settings'

export const SETTING_ENABLED = 'memo-button-enabled'

store.dispatch(
  registerSetting({
    id: SETTING_ENABLED,
    type: SettingValueType.Checkbox,
    defaultValue: true,
    menu: SettingCategory.AdList,
    title: 'Memo poga',
    description: 'Pievieno sludinājumu Memo'
  })
)

addButton((row: Element) => {
  const rowId = row.getAttribute('id')

  if (rowId) {
    const id = parseId(rowId)
    return <MemoButton key="memo-button" id={id} />
  }
})

whenLoaded(() => {
  const counter = document.querySelector('#mnu_fav_id')

  if (counter) {
    renderReact(<MemoCounter />, counter)
  }

  store.dispatch(fetchMemoItems())
})
