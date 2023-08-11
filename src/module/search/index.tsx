import { SearchBar } from './components/SearchBar'
import { SettingCategory, SettingValueType } from 'core/module/settings/types'
import { addHtbElement } from 'core/containers/htb-container'
import { registerSetting } from 'core/module/settings'

export const SETTING_ENABLED = 'search-enabled'

registerSetting({
  id: SETTING_ENABLED,
  type: SettingValueType.Checkbox,
  defaultValue: true,
  needsReload: false,
  menu: SettingCategory.Search,
  title: 'Ieslēgts'
})

addHtbElement(<SearchBar key="search" />)
