import { whenLoaded } from 'util/lifecycle'
import { SearchBar } from './components/SearchBar'
import { loadDefaultIndex } from './data/indexer'
import { getItem, registerSetting } from 'core/module/settings/storage'
import { SettingCategory, SettingValueType } from 'core/module/settings/types'
import { renderReact } from 'util/react'

const SETTING_ENABLED = 'search-enabled'

registerSetting({
  id: SETTING_ENABLED,
  type: SettingValueType.Checkbox,
  defaultValue: 'true',
  menu: SettingCategory.Search,
  title: 'Ieslēgts'
})

whenLoaded(() => {
  if (getItem(SETTING_ENABLED) !== 'true') return

  const insertPoint = document.querySelector('#page_main_full')

  if (!insertPoint) {
    return
  }

  loadDefaultIndex()

  if (insertPoint) {
    renderReact(<SearchBar />, insertPoint, 'prepend')
  }
})
