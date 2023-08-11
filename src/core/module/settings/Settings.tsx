import clsx from 'clsx'
import { useEffect, useState, FC, useCallback, useMemo } from 'react'
import { Checkbox } from './components/checkbox'
import browser from 'webextension-polyfill'

import { BSS } from 'core/bss'
import { SettingValueType, SettingsCategory } from './types'
import { Select } from './components/select'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalState } from '../global-state/store'
import { Button } from 'core/components/Button'
import { updateSetting } from './state/settings.slice'
import { SETTINGS_CATEGORIES } from '.'

export const Settings: FC = () => {
  const dispatch = useDispatch<any>()
  const [needsReload, setNeedsReload] = useState(false)
  const settings = useSelector((state: GlobalState) => state.settings.settings || [])
  const [activeSetting, setActiveSetting] = useState<SettingsCategory|undefined>()

  const handleSettingChange = useCallback((id: string, value: string, needsReload = false) => {
    if (needsReload) {
      setNeedsReload(true)
    }

    dispatch(updateSetting({
      id, value
    }))
  }, [])

  const activeSettingItems = useMemo(() => {
    return settings.filter((item: any) => item.menu === activeSetting?.id)
  }, [settings, activeSetting])

  const deleteAllSettings = async () => {
    if (window.confirm('Vai tiešām vēlaties dzēst visus iestatījumus?')) {
      await browser.storage.sync.clear()
      await browser.storage.local.clear()
      window.location.reload()
    }
  }

  useEffect(() => {
    if (!activeSetting) {
      setActiveSetting(SETTINGS_CATEGORIES[0])
    }
  }, [activeSetting])

  return (
    <div className="bss-settings">
      {
        needsReload && (
          <Button variant='neutral' onClick={() => window.location.reload()} className="bss-settings-reload">
            Pārlādēt lapu
          </Button>
        )
      }
      <div className="bss-settings-menu">
        <div className="bss-settings-menu-items">
        {
          SETTINGS_CATEGORIES.map(item => {
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
        {/* <div className="bss-settings-reset">
          <span onClick={deleteAllSettings}>Dzēst visus iestatījumus</span>
        </div> */}
        <div className="bss-settings-version">
          <div>Versija: { BSS.version.full }</div>
          <a target='_blank' href="https://bmc.link/raideer" rel="noreferrer"><span className="icon-coin-euro"></span></a>
        </div>
      </div>
      <div className="bss-settings__settings">
        <div className="bss-settings__settings-title">{ activeSetting && activeSetting.title }</div>
        { activeSettingItems && (
          activeSettingItems.map((item: any) => {
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
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
