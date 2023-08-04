import { whenLoaded } from 'util/lifecycle'

import { renderReact } from 'util/react'
import store from '../global-state/store'
import { loadSettings } from './state/settings.thunk'
import watch from 'redux-watch'
import { WatcherCallback } from './types'
import { SettingsButton } from './SettingsButton'

export const getSetting = (key: string, defaultValue: any = undefined) => {
  const state = store.getState()
  return state.settings.values[key] || defaultValue
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

store.dispatch(loadSettings())

whenLoaded(() => {
  const insertPoint = document.querySelector('.menu_lang')

  if (insertPoint) {
    renderReact(<SettingsButton />, insertPoint, 'append')
  }
})
