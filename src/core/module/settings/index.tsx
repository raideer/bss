import { whenLoaded } from 'util/lifecycle'

import WinBox from 'winbox/src/js/winbox'
import { useState } from 'react'
import { Settings } from './Settings'
import { renderReact } from 'util/react'
import { migrateToStorage, updateLocalStorage } from './storage'

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
    renderReact(<Settings />, wb.body, 'append')
  }

  return (<button className="bss-button bss-button-neutral bss-settings-button" onClick={onClick}>BSS</button>)
}

whenLoaded(() => {
  const insertPoint = document.querySelector('.menu_lang')

  if (insertPoint) {
    renderReact(<SettingsButton />, insertPoint, 'append')
  }
})

migrateToStorage().then(() => {
  updateLocalStorage()
})
