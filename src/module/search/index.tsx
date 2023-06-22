import { render } from "preact"
import { whenLoaded } from "util/lifecycle"
import { SearchBar } from "./SearchBar"
import { indexCategories } from "./indexer"
import { getItem, registerSetting } from "module/settings/storage"
import { SettingCategory, SettingValueType } from "module/settings/types"

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

  indexCategories()

  if (insertPoint) {
    render(<SearchBar />, insertPoint)
  }
})
