import { Button } from 'core/components/Button'
import { applyFilter, getCurrentFilterData, getDataHash, getSaveKey } from '../common'
import { FC, useMemo, useState } from 'react'
import { FilterModal } from './FilterModal'
import { useSelector } from 'react-redux'
import { GlobalState } from 'core/module/global-state/store'
import { STORAGE_MEMORY } from '..'
import { FilterPreset } from './FilterPreset'

export const Filters: FC = () => {
  const savedFilters = useSelector((state: GlobalState) => {
    return state.settings.values[STORAGE_MEMORY] || {}
  })
  const [modalFilter, setModalFilter] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const saveKey = getSaveKey()

  const editFilter = (key: string) => {
    setModalFilter(key)
    setModalOpen(true)
  }

  const presets = useMemo(() => {
    const form = document.querySelector('#filter_frm') as HTMLFormElement
    const currentHash = getDataHash(getCurrentFilterData(form))
    const items: { name: string; isActive: boolean, filter: any }[] = []

    if (savedFilters[saveKey]) {
      for (const name in savedFilters[saveKey]) {
        if (!savedFilters[saveKey][name]) {
          continue
        }

        const isActive = currentHash === savedFilters[saveKey][name].id

        items.push({
          name: name,
          isActive: isActive,
          filter: savedFilters[saveKey][name]
        })
      }
    }

    return items
  }, [savedFilters])

  const canSave = useMemo(() => {
    return !!document.querySelector('[id^=tr_')
  }, [])

  const handleClose = () => {
    setModalFilter(null)
    setModalOpen(false)
  }

  if (!canSave && !presets.length) {
    return null
  }

  return (
    <div className="bss-fm-container">
      <div className="bss-fm-presets">
        {presets.map(preset => {
          return (
            <FilterPreset
              onEdit={() => editFilter(preset.name)}
              onApply={() => applyFilter(savedFilters[saveKey][preset.name])}
              key={preset.name}
              name={preset.name}
              active={preset.isActive} />
          )
        })}
      </div>
      <FilterModal key={modalFilter || 'new'} filter={modalFilter} visible={modalOpen} onClose={handleClose} />
      {canSave && <Button variant="neutral" className="bss-fm-btn" onClick={() => setModalOpen(true)}>Saglabāt filtrus</Button>}
    </div>
  )
}
