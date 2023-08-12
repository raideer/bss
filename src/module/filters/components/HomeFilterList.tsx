import { GlobalState } from 'core/module/global-state/store'
import { FC } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'core/components/Button'
import { applyFilter } from '../helpers'
import { FilterPreset } from '../types'
import { SETTING_ENABLED } from '../common'

export const HomeFilterList: FC = () => {
  const enabled = useSelector((state: GlobalState) => state.settings.values[SETTING_ENABLED])

  const presets = useSelector((state: GlobalState) => {
    return state.filter.presets || []
  })

  if (!enabled) {
    return null
  }

  return <div className='bss-fm-home-list'>
    {presets.map((preset: FilterPreset) => {
      return <Button onClick={() => applyFilter(preset)} size="xs" key={preset.id}>{preset.name}</Button>
    })}
  </div>
}
