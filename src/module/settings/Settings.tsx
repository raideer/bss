import clsx from "clsx";
import { useEffect, useState } from "preact/hooks"
import { Checkbox } from "./components/checkbox";
import { getSettings, SettingsCategory, SettingValueType } from "./storage";

export const Settings = () => {
  const menu = getSettings()
  const [activeSetting, setActiveSetting] = useState<SettingsCategory|null>(null);

  useEffect(() => {
    if (!activeSetting) {
      setActiveSetting(menu[0])
    }
  }, [activeSetting, menu])

  return (
    <div className="bss-settings">
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
          <div>Versija: { BSS.version.toString() }</div>
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
                    <Checkbox setting={item} />
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
