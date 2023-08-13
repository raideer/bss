import { Button } from 'core/components/Button'
import { applyFilter, filterParamsToId, getCurrentFilterParams, getFilterLocationKey } from '../helpers'
import { FC, useMemo, useState } from 'react'
import { FilterModal } from './FilterModal'
import { useSelector } from 'react-redux'
import { GlobalState } from 'core/module/global-state/store'
import { FilterPreset as Preset } from './FilterPreset'
import { FilterPreset } from '../types'
import { PageLocation, getPageInfo } from 'util/context'

export const Filters: FC = () => {
  const [modalPreset, setModalPreset] = useState<FilterPreset | undefined>()
  const [modalOpen, setModalOpen] = useState(false)

  const editFilter = (preset: FilterPreset) => {
    setModalPreset(preset)
    setModalOpen(true)
  }

  const presets = useSelector((state: GlobalState) => {
    return (state.filter.presets || []).filter(preset => {
      return getFilterLocationKey(preset.path) === getFilterLocationKey()
    })
  })

  const currentId = useMemo(() => {
    const params = getCurrentFilterParams()
    return filterParamsToId(params)
  }, [])

  const pageInfo = getPageInfo()
  const canSave = pageInfo.location === PageLocation.AdList

  const handleClose = () => {
    setModalPreset(undefined)
    setModalOpen(false)
  }

  if (!canSave && !presets.length) {
    return null
  }

  return (
    <div className="bss-fm-container">
      <div className="bss-fm-presets">
        {presets.map((preset) => {
          return (
            <Preset
              onEdit={() => editFilter(preset)}
              onApply={() => applyFilter(preset)}
              key={preset.id}
              name={preset.name}
              active={currentId === preset.id} />
          )
        })}
      </div>
      <FilterModal key={modalPreset?.id || 'new'} preset={modalPreset} visible={modalOpen} onClose={handleClose} />
      {canSave && <Button variant="neutral" className="bss-fm-btn" onClick={() => setModalOpen(true)}>Izveidot filtru</Button>}
    </div>
  )
}
