import { whenLoaded } from 'util/lifecycle'

import { renderReact } from 'util/react'
import store from '../global-state/store'
import watch from 'redux-watch'
import { Setting, SettingCategory, SettingsCategory, WatcherCallback } from './types'
import { SettingsButton } from './SettingsButton'
import { whenPersisted } from '../global-state/lifecycle'
import { registerSetting as registerSettingAction } from 'core/module/settings/state/settings.slice'

export const SETTINGS_CATEGORIES: SettingsCategory[] = [
  {
    id: SettingCategory.AdList,
    title: 'Sludinājumu saraksts'
  },
  {
    id: SettingCategory.Appearance,
    title: 'Izskats'
  },
  {
    id: SettingCategory.Filters,
    title: 'Filtri'
  },
  {
    id: SettingCategory.Search,
    title: 'Meklēšana'
  }
]

export const getSetting = (key: string, defaultValue: any = undefined) => {
  const state = store.getState()
  return state.settings.values[key] || defaultValue
}

export const registerSetting = (setting: Setting) => {
  whenPersisted(() => {
    store.dispatch(
      registerSettingAction(setting)
    )
  })
}

const watchers: { watcher: any, callback: WatcherCallback }[] = []

export const subscribeToSetting = (key: string, callback: WatcherCallback) => {
  const watcher = watch(store.getState, 'settings.values.' + key)
  watchers.push({
    watcher,
    callback
  })
}

store.subscribe(() => {
  watchers.forEach(({ watcher, callback }) => {
    watcher(callback)()
  })
})

whenLoaded(() => {
  const insertPoint = document.querySelector('.menu_lang')

  if (insertPoint) {
    renderReact(<SettingsButton />, insertPoint, 'append')
  }
})
