import { useEffect, useState } from "preact/hooks"
import { getItem } from "../storage"
import { FC, useCallback } from "react";
import { CheckboxSetting } from "../types";

interface Props {
  setting: CheckboxSetting;
  onChange: (id: CheckboxSetting['id'], value: string) => void;
}

export const Checkbox: FC<Props> = ({ setting, onChange }) => {
  const [settingValue, setSettingValue] = useState(false)

  const updateValue = useCallback((event: any) => {
    onChange(setting.id, event.target.checked ? 'true' : 'false')
    setSettingValue(event.target.checked)
  }, [onChange, setting.id])

  useEffect(() => {
    const val = getItem(setting.id, true)
    setSettingValue(val === 'true')
  }, [setting])

  return (
    <div className="bss-settings__checkbox">
      <label>
        <input onChange={updateValue} checked={settingValue} type="checkbox" />
        { setting.title }
      </label>
      { setting.description && <span class="bss-settings__input-description">{ setting.description }</span>}
    </div>
  )
}
