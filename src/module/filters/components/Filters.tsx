import { Button } from 'core/components/Button'
import { getLocationPath } from 'util/page-info'
import take from 'lodash-es/take'
import clsx from 'clsx'
import { getCurrentFilterData, getDataHash, getSavedFilters } from '../common'
import { FC, useEffect, useState } from 'react'
import { FilterModal } from './FilterModal'

export const Filters: FC = () => {
  const [modalFilter, setModalFilter] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [presets, setPresets] = useState<any[]>([])
  const pageInfo = take(getLocationPath().filter((part: string) => !['filter'].includes(part)), 2)
  const saveKey = pageInfo.join('_')

  const applyFilter = (filter: any) => {
    const form = document.querySelector('#filter_frm') as HTMLFormElement

    if (form) {
      form.setAttribute('action', filter.path)

      for (const key in filter.data) {
        const input = form.querySelector(key) as HTMLInputElement

        if (input) {
          input.value = filter.data[key]
        }
      }

      form.submit()
    }
  }

  const editFilter = (key: string) => {
    setModalFilter(key)
    setModalOpen(true)
  }

  const renderPresets = async () => {
    const savedFilters = await getSavedFilters()
    const form = document.querySelector('#filter_frm') as HTMLFormElement
    const currentHash = getDataHash(getCurrentFilterData(form))

    const items: any[] = []

    if (savedFilters[saveKey]) {
      for (const name in savedFilters[saveKey]) {
        const isActive = currentHash === savedFilters[saveKey][name].id

        items.push((
          <div key={name} className={clsx({
            'bss-fm-preset': true
          })}>
            <Button active={isActive} variant={isActive ? 'accent' : 'neutral'} onClick={() => { applyFilter(savedFilters[saveKey][name]) }} >{name}</Button>
            <Button active={isActive} variant={isActive ? 'accent' : 'neutral'} onClick={() => { editFilter(name) }}>
              <span className="icon-edit-pencil"></span>
            </Button>
          </div>
        ))
      }
    }

    setPresets(items)
  }

  const handleClose = () => {
    setModalFilter(null)
    setModalOpen(false)
  }

  useEffect(() => {
    renderPresets()
  }, [])

  return (
    <div className="bss-fm-container">
      <div className="bss-fm-presets">
        {presets}
      </div>
      <FilterModal key={modalFilter || 'new'} filter={modalFilter} onSave={() => renderPresets()} visible={modalOpen} onClose={handleClose} />
      <Button variant="neutral" className="bss-fm-btn" onClick={() => setModalOpen(true)}>Saglabāt filtrus</Button>
    </div>
  )
}
