import { useEffect, useState, FC, useCallback } from 'react'
import { getItem } from '../storage'

import { CheckboxSetting } from '../types'

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
      <div className="bss-form-control">
        <label className='bss-label'>
          <div className="bss-label-text">{ setting.title }</div>
          <input className='bss-checkbox' onChange={updateValue} checked={settingValue} type="checkbox" />
        </label>
      </div>
      { setting.description && <span className="bss-settings__input-description">{ setting.description }</span>}
    </div>
  )
}
