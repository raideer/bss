import { Button } from 'core/components/Button'
import { applyFilter, filterParamsToId, getCurrentFilterParams, getFilterLocationKey } from '../common'
import { FC, useMemo, useState } from 'react'
import { FilterModal } from './FilterModal'
import { useSelector } from 'react-redux'
import { GlobalState } from 'core/module/global-state/store'
import { FilterPreset as Preset } from './FilterPreset'
import { FilterPreset } from '../types'
import { isListingPage } from 'util/page-info'
import { startsWith } from 'lodash-es'

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

  const canSave = isListingPage()

  const handleClose = () => {
    setModalPreset(undefined)
    setModalOpen(false)
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