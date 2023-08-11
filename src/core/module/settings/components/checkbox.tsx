import { FC, useCallback } from 'react'

import { CheckboxSetting, SettingChangeCallback } from '../types'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalState } from 'core/module/global-state/store'
import { updateSetting } from '../state/settings.slice'

interface Props {
  setting: CheckboxSetting;
  onChange: SettingChangeCallback;
}

export const Checkbox: FC<Props> = ({ setting, onChange }) => {
  const dispatch = useDispatch<any>()
  const settingValue = useSelector((state: GlobalState) => state.settings.values[setting.id])

  const updateValue = useCallback((event: any) => {
    onChange(setting.id, event.target.checked, setting.needsReload)
    dispatch(updateSetting({
      id: setting.id,
      value: event.target.checked
    }))
  }, [onChange, setting.id])

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
