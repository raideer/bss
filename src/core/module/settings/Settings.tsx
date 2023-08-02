import clsx from 'clsx'
import { useEffect, useState, FC, useCallback } from 'react'
import { Checkbox } from './components/checkbox'
import { getSettings, setItem } from './storage'

import { BSS } from 'core/bss'
import { SettingValueType, SettingsCategory } from './types'
import { Select } from './components/select'
import { Text } from './components/text'

export const Settings: FC = () => {
  const menu = getSettings()
  const [needsReload, setNeedsReload] = useState(false)
  const [activeSetting, setActiveSetting] = useState<SettingsCategory|undefined>()

  const handleSettingChange = useCallback((id: string, value: string) => {
    setItem(id, value)
    setNeedsReload(true)
  }, [setItem, setNeedsReload])

  useEffect(() => {
    if (!activeSetting) {
      setActiveSetting(menu[0])
    }
  }, [activeSetting, menu])

  return (
    <div className="bss-settings">
      {
        needsReload && (
          <button type="button" onClick={() => window.location.reload()} className="bss-button bss-settings-reload">
            Pārlādēt lapu
          </button>
        )
      }
      <div className="bss-settings-menu">
        <div className="bss-settings-menu-items">
        {
          menu.map(item => {
            return (
              <button key={item.id} onClick={() => setActiveSetting(item)} className={clsx({
                'bss-settings-menu-item': true,
                'bss-settings-menu-item--active': activeSetting && activeSetting.id === item.id
              })}>
                { item.title }
              </button>
            )
          })
        }
        </div>
        <div className="bss-settings-version">
          <div>Versija: { BSS.version.full }</div>
          <a target='_blank' href="https://bmc.link/raideer" rel="noreferrer"><span className="icon-coin-euro"></span></a>
        </div>
      </div>
      <div className="bss-settings__settings">
        <div className="bss-settings__settings-title">{ activeSetting && activeSetting.title }</div>
        { activeSetting && (
          activeSetting.items.map(item => {
            return (
              <div className="bss-settings__settings-item" key={item.id}>
                {
                  item.type === SettingValueType.Checkbox && (
                    <Checkbox onChange={handleSettingChange} setting={item} />
                  )
                }
                {
                  item.type === SettingValueType.Select && (
                    <Select onChange={handleSettingChange} setting={item} />
                  )
                }
                {
                  item.type === SettingValueType.Text && (
                    <Text onChange={handleSettingChange} setting={item} />
                  )
                }
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
