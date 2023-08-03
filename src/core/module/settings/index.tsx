import { whenLoaded } from 'util/lifecycle'

import WinBox from 'winbox/src/js/winbox'
import { useState } from 'react'
import { Settings } from './Settings'
import { renderReact } from 'util/react'
import store from '../global-state/store'
import { loadSettings } from './state/settings.thunk'
import watch from 'redux-watch'
import { Provider } from 'react-redux'
import { WatcherCallback } from './types'

declare global {
  interface Window {
    WinBox: any;
  }
}

const SettingsButton = () => {
  const [settingsWindow, setWindow] = useState<any>(null)

  const onClick = () => {
    if (settingsWindow) return

    const wb = WinBox.new({
      title: 'BSS',
      width: '800px',
      height: '470px',
      x: 'center',
      top: '50px',
      class: [
        'bss-settings__window'
      ],
      onclose: () => {
        setWindow(null)
      }
    })

    setWindow(wb)
    renderReact(<Provider store={store}><Settings /></Provider>, wb.body, 'append')
  }

  return (<button className="bss-button bss-button-neutral bss-settings-button" onClick={onClick}>BSS</button>)
}

whenLoaded(() => {
  const insertPoint = document.querySelector('.menu_lang')

  if (insertPoint) {
    renderReact(<SettingsButton />, insertPoint, 'append')
  }
})

export const getSetting = (key: string) => {
  const state = store.getState()
  return state.settings.values[key]
}

const watchers: { watcher: any, callback: WatcherCallback }[] = []

export const subscribeToSetting = (key: string, callback: WatcherCallback) => {
  const watcher = watch(store.getState, 'settings.values.' + key)
  watchers.push({
    watcher,
    callback
  })
}

// const watcher = watch(store.getState, 'settings.loaded')

store.subscribe(() => {
  watchers.forEach(({ watcher, callback }) => {
    watcher(callback)()
  })
})

store.dispatch(loadSettings())
