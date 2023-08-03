import { dom } from 'util/dom'
import { whenLoaded } from 'util/lifecycle'
import { SettingCategory, SettingValueType } from 'core/module/settings/types'
import { renderReact } from 'util/react'
import { Filters } from './components/Filters'
import store from 'core/module/global-state/store'
import { registerSetting } from 'core/module/settings/state/settings.thunk'
import { getSetting, subscribeToSetting } from 'core/module/settings'
import { Provider } from 'react-redux'

export const SETTING_ENABLED = 'memory-enabled'
export const SETTING_NOTIFICATIONS_ENABLED = 'memory-notifications-enabled'

export const STORAGE_MEMORY = 'filters'

store.dispatch(
  registerSetting({
    id: SETTING_ENABLED,
    type: SettingValueType.Checkbox,
    defaultValue: true,
    needsReload: true,
    menu: SettingCategory.Filters,
    title: 'Filtri',
    description: 'Saglabā un uzstādi filtrus ar 1 klikšķi'
  })
)

store.dispatch(
  registerSetting({
    id: SETTING_NOTIFICATIONS_ENABLED,
    type: SettingValueType.Checkbox,
    defaultValue: true,
    needsReload: true,
    menu: SettingCategory.Filters,
    title: 'Sludinājumu paziņojumi',
    description: 'Saņem paziņojumus par jauniem sludinājumiem, kas atbilst filtram'
  })
)

const renderFilters = () => {
  const filterForm = document.querySelector('#filter_frm')

  if (!filterForm) {
    return
  }

  const container = dom('div', { class: 'bss-fm' })
  filterForm.prepend(container)
  renderReact(<Provider store={store}><Filters /></Provider>, container)
}

whenLoaded(() => {
  if (!getSetting(SETTING_ENABLED)) return

  renderFilters()
})
