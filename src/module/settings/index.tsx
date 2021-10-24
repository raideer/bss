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
      title: 'SS+',
      background: '#E9E9E9',
      width: '800px',
      height: '470px',
      x: "center",
      top: "50px",
      class: [
        'ssplus-settings__window'
      ],
      onclose: () => {
        setWindow(null)
      }
    })

    setWindow(wb)
    render(<Settings />, wb.body)
  }

  return (<button className="ssplus-settings__button" onClick={onClick}>SS+</button>)
}

whenLoaded(() => {
  const insertPoint = document.querySelector('.menu_lang')
  if (insertPoint) {
    render(<SettingsButton />, insertPoint)
  }
})