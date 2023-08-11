import { FC, useCallback } from 'react'

import { SelectSetting, SettingChangeCallback } from '../types'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalState } from 'core/module/global-state/store'
import { updateSetting } from '../state/settings.slice'

interface Props {
  setting: SelectSetting;
  onChange: SettingChangeCallback;
}

export const Select: FC<Props> = ({ setting, onChange }) => {
  const dispatch = useDispatch<any>()
  const settingValue = useSelector((state: GlobalState) => state.settings.values[setting.id])

  const updateValue = useCallback((event: any) => {
    onChange(setting.id, event.target.value, setting.needsReload)
    dispatch(updateSetting({
      id: setting.id,
      value: event.target.value
    }))
  }, [onChange, setting.id])

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
