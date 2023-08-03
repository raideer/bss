import { whenLoaded } from 'util/lifecycle'
import { SearchBar } from './components/SearchBar'
import { loadDefaultIndex } from './data/indexer'
import { SettingCategory, SettingValueType } from 'core/module/settings/types'
import { renderReact } from 'util/react'
import store from 'core/module/global-state/store'
import { registerSetting } from 'core/module/settings/state/settings.thunk'
import { getSetting } from 'core/module/settings'

const SETTING_ENABLED = 'search-enabled'

store.dispatch(registerSetting({
  id: SETTING_ENABLED,
  type: SettingValueType.Checkbox,
  defaultValue: true,
  needsReload: true,
  menu: SettingCategory.Search,
  title: 'Ieslēgts'
}))

whenLoaded(() => {
  if (!getSetting(SETTING_ENABLED)) return

  const insertPoint = document.querySelector('#page_main_full')

  if (!insertPoint) {
    return
  }

  loadDefaultIndex()

  if (insertPoint) {
    renderReact(<SearchBar />, insertPoint, 'prepend')
  }
})
