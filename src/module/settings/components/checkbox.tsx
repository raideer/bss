import { useEffect, useState } from "preact/hooks"
import { getItem, setItem, Setting } from "../storage"

interface Props {
  setting: Setting;
}

export const Checkbox = ({ setting }: Props) => {
  const [settingValue, setSettingValue] = useState(false)

  const updateValue = (event: any) => {
    console.log(event.target.checked)
    setItem(setting.id, event.target.checked ? 'true' : 'false')
  }

  useEffect(() => {
    getItem(setting.id).then(val => {
      setSettingValue(val === 'true')
    })
  }, [setting])

  return (
    <div className="ssplus-settings__checkbox">
      <label>
        <input onChange={updateValue} checked={settingValue} type="checkbox" />
        { setting.title }
      </label>
      { setting.description && <span class="ssplus-settings__checkbox-description">{ setting.description }</span>}
    </div>
  )
}
