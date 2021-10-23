import classnames from "classnames";
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
    <div className="ssplus-settings">
      <div className="ssplus-settings__menu">
        {
          menu.map(item => {
            return (
              <button key={item.id} onClick={() => setActiveSetting(item)} className={classnames({
                'ssplus-settings__menu-item': true,
                'ssplus-settings__menu-item--active': activeSetting && activeSetting.id === item.id
              })}>
                { item.title }
              </button>
            )
          })
        }
        <div className="ssplus-settings__version">
          <div>Versija: { SSPlusVersion.major }.{ SSPlusVersion.minor }.{ SSPlusVersion.patch }</div>
          <div>{ SSPlusVersion.commit }</div>
        </div>
      </div>
      <div className="ssplus-settings__settings">
        <div className="ssplus-settings__settings-title">{ activeSetting && activeSetting.title }</div>
        { activeSetting && (
          activeSetting.items.map(item => {
            return (
              <div key={item.id}>
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
