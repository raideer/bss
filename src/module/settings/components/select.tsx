import { useEffect, useState } from "preact/hooks"
import { getItem } from "../storage"
import { FC, useCallback } from "react";
import { SelectSetting } from "../types";

interface Props {
  setting: SelectSetting;
  onChange: (id: SelectSetting['id'], value: string) => void;
}

export const Select: FC<Props> = ({ setting, onChange }) => {
  const [settingValue, setSettingValue] = useState<string | null>(null)

  const updateValue = useCallback((event: any) => {
    onChange(setting.id, event.target.value)
    setSettingValue(event.target.value)
  }, [onChange, setting.id])

  useEffect(() => {
    const val = getItem(setting.id, true)
    setSettingValue(val)
  }, [setting])

  return (
    <div className="bss-settings__select">
        <span>{ setting.title }</span>
        <select onChange={updateValue}>
          { setting.options.map(option => <option selected={settingValue === option.value} key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      { setting.description && <span class="bss-settings__input-description">{ setting.description }</span>}
    </div>
  )
}
