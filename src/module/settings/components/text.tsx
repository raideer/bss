import { useEffect, useState } from "preact/hooks"
import { getItem } from "../storage"
import { FC, useCallback } from "react";
import { TextSetting } from "../types";

interface Props {
  setting: TextSetting;
  onChange: (id: TextSetting['id'], value: string) => void;
}

export const Text: FC<Props> = ({ setting, onChange }) => {
  const [dirty, setDirty] = useState(false)
  const [settingValue, setSettingValue] = useState<string>('')

  const disabled = setting.disabled === true

  const updateValue = useCallback((event: any) => {
    setSettingValue(event.target.value)
    setDirty(true)
  }, [onChange, setting.id])

  useEffect(() => {
    const val = getItem(setting.id, true)

    if (val) {
      setSettingValue(val)
    }
  }, [setting])

  return (
    <div className="bss-settings__select">
        <span>{ setting.title }</span>
        <input value={settingValue} disabled={disabled} type="text" onChange={updateValue} />
      { setting.description && <span class="bss-settings__input-description">{ setting.description }</span>}
      { dirty && <button disabled={disabled} className="bss-settings__reload" onClick={() => onChange(setting.id, settingValue || '')}>Saglabāt</button>}
    </div>
  )
}
