import { useState } from 'react'
import { Provider } from 'react-redux'
import { renderReact } from 'util/react'
import WinBox from 'winbox/src/js/winbox'
import { Settings } from './Settings'
import store from '../global-state/store'
import { Button } from 'core/components/Button'

export const SettingsButton = () => {
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

  return (<Button variant='neutral' className="bss-settings-button" onClick={onClick}>BSS</Button>)
}
