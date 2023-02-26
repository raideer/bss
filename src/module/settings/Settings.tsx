import clsx from "clsx";
import { useEffect, useState } from "preact/hooks"
import { Checkbox } from "./components/checkbox";
import { getSettings, setItem, SettingsCategory, SettingValueType } from "./storage";
import { FC, useCallback } from "react";
import { BSS } from "core/bss";

export const Settings: FC = () => {
  const menu = getSettings()
  const [needsReload, setNeedsReload] = useState(false)
  const [activeSetting, setActiveSetting] = useState<SettingsCategory|null>(null);

  const handleSettingChange = useCallback((id: string, value: boolean) => {
    setItem(id, value ? 'true' : 'false')
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
          <button type="button" onClick={() => window.location.reload()} className="bss-settings__reload">
            Pārlādēt lapu
          </button>
        )
      }
      <div className="bss-settings__menu">
        <div className="bss-settings__menu-items">
        {
          menu.map(item => {
            return (
              <button key={item.id} onClick={() => setActiveSetting(item)} className={clsx({
                'bss-settings__menu-item': true,
                'bss-settings__menu-item--active': activeSetting && activeSetting.id === item.id
              })}>
                { item.title }
              </button>
            )
          })
        }
        </div>
        <div className="bss-settings__version">
          <div>Versija: { BSS.version.full }</div>
          <div>
            <a
              target="_blank"
              href={`https://github.com/raideer/bss/commit/${BSS.version.commit}`}
              rel="noreferrer">
                { BSS.version.commit.substring(0, 7) }
            </a>
          </div>
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
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
