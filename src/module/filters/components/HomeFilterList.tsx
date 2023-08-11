import { GlobalState } from 'core/module/global-state/store'
import { FC } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'core/components/Button'
import { applyFilter } from '../common'
import { FilterPreset } from '../types'

export const HomeFilterList: FC = () => {
  const presets = useSelector((state: GlobalState) => {
    return state.filter.presets || []
  })

  return <div className='bss-fm-home-list'>
    {presets.map((preset: FilterPreset) => {
      return <Button onClick={() => applyFilter(preset)} size="xs" key={preset.id}>{preset.name}</Button>
    })}
  </div>
}
