import { useEffect, useState, FC, useCallback } from 'react'
import { getItem } from '../storage'

import { SelectSetting } from '../types'

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

  if (!settingValue) return null

  return (
    <div className="bss-settings__select">
        <span>{ setting.title }</span>
        <select value={settingValue} className='bss-input' onChange={updateValue}>
          { setting.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      { setting.description && <span className="bss-settings__input-description">{ setting.description }</span>}
    </div>
  )
}
