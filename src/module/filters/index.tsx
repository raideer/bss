import { getItem, registerSetting } from 'core/module/settings/storage'
import { dom } from 'util/dom'
import { whenLoaded } from 'util/lifecycle'
import { SettingCategory, SettingValueType } from 'core/module/settings/types'
import { renderReact } from 'util/react'
import { Filters } from './components/Filters'

export const SETTING_ENABLED = 'memory-enabled'
export const SETTING_NOTIFICATIONS_ENABLED = 'memory-notifications-enabled'

export const STORAGE_MEMORY = 'filters'

registerSetting({
  id: SETTING_ENABLED,
  type: SettingValueType.Checkbox,
  defaultValue: 'true',
  menu: SettingCategory.Filters,
  title: 'Filtri',
  description: 'Saglabā un uzstādi filtrus ar 1 klikšķi'
})

registerSetting({
  id: SETTING_NOTIFICATIONS_ENABLED,
  type: SettingValueType.Checkbox,
  defaultValue: 'true',
  menu: SettingCategory.Filters,
  title: 'Sludinājumu paziņojumi',
  description: 'Saņem paziņojumus par jauniem sludinājumiem, kas atbilst filtram'
})

whenLoaded(() => {
  const enabled = getItem(SETTING_ENABLED)
  if (enabled !== 'true') return

  const filterForm = document.querySelector('#filter_frm')

  if (!filterForm) {
    return
  }

  const container = dom('div', { class: 'bss-fm' })

  filterForm.prepend(container)

  renderReact(<Filters />, container)
})
