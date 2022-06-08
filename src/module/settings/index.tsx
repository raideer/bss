import { whenLoaded } from 'util/lifecycle'

import WinBox from 'winbox/src/js/winbox'
import { render } from 'preact'
import { useState } from 'preact/hooks'
import { Settings } from './Settings'

declare global {
  interface Window {
    WinBox: any;
  }
}

const SettingsButton = () => {
  const [settingsWindow, setWindow] = useState<any>(null);

  const onClick = () => {
    if (settingsWindow) return

    const wb = WinBox.new({
      title: 'BSS',
      width: '800px',
      height: '470px',
      x: "center",
      top: "50px",
      class: [
        'bss-settings__window'
      ],
      onclose: () => {
        setWindow(null)
      }
    })

    setWindow(wb)
    render(<Settings />, wb.body)
  }

  return (<button className="bss-settings__button" onClick={onClick}>BSS</button>)
}

whenLoaded(() => {
  const insertPoint = document.querySelector('.menu_lang')
  if (insertPoint) {
    render(<SettingsButton />, insertPoint)
  }
})
