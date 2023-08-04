import { Button } from 'core/components/Button'
import { Modal } from 'core/components/Modal'
import { FC } from 'react'
import { getCurrentFilterData, getDataHash, getSaveKey, saveFilters } from '../common'
import { get } from 'lodash-es'
import { useForm } from 'react-hook-form'
import { error } from 'util/logger'
import { useSelector } from 'react-redux'
import { GlobalState } from 'core/module/global-state/store'
import { STORAGE_MEMORY } from '..'

interface Props {
  filter: string | null;
  visible: boolean;
  onClose: () => void;
}

export const FilterModal: FC<Props> = ({ filter, visible, onClose }) => {
  const savedFilters = useSelector((state: GlobalState) => state.settings.values[STORAGE_MEMORY] || {})
  const saveKey = getSaveKey()
  const existingFilter = filter && get(savedFilters, `${saveKey}.${filter}`)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: filter,
      notifications: !!existingFilter?.notifications
    }
  })

  const saveAndClose = (savedFilters: any) => {
    saveFilters(savedFilters)
    onClose()
  }

  const saveCurrentFilters = async (values: any) => {
    const form = document.querySelector('#filter_frm') as HTMLFormElement

    if (!form) {
      error('Filter form not found')
      return
    }

    const path = document.location.pathname
    const data = getCurrentFilterData(form)
    const formData = new URLSearchParams((new FormData(form) as any))

    // savedFilters is immutable, so we need to create a new object
    const newFilters = JSON.parse(JSON.stringify(savedFilters))

    if (!newFilters[saveKey]) {
      newFilters[saveKey] = {}
    }

    if (filter) {
      delete newFilters[saveKey][filter]
    }

    newFilters[saveKey][values.name] = {
      data,
      formData: formData.toString(),
      path,
      notifications: !!values.notifications,
      id: getDataHash(data)
    }

    saveAndClose(newFilters)
  }

  const deleteFilter = async () => {
    if (filter && savedFilters[saveKey]) {
      const newFilters = { ...savedFilters }
      newFilters[saveKey][filter] = undefined
      saveAndClose(newFilters)
    }
  }

  return (
    <Modal visible={visible} title={filter ? 'Filtra iestatījumi' : 'Jauns filtrs'} onClose={onClose}>
      <div className="bss-form-control">
        <form onSubmit={handleSubmit(saveCurrentFilters)}>

          <div className="bss-form-control">
            <label htmlFor="filter-name" className="bss-label">
              <span className="label-text">Filtra nosaukums:</span>
            </label>
            <input {...register('name', { required: true })} id="filter-name" className="bss-input" />
            {errors.name && <span className='mt-10'>Lūdzu ievadi nosaukumu</span>}
          </div>

          <div className="bss-form-control mt-20">
            <label className="bss-label">
              <span className="label-text">Ieslēgt paziņojumus:</span>
              <input type='checkbox' {...register('notifications')} className="bss-checkbox" />
            </label>
            <span className="label-text-alt">Automātiski saņem pārlūka paziņojumus par jauniem sludinājumiem, kas atbilst šim filtram</span>
          </div>

          <div className="w-100 flex justify-between mt-20">
            <Button type="submit" size="md" variant="accent">
              Saglabāt
            </Button>
            {filter && <Button onClick={deleteFilter} size="md" variant="neutral">
              Dzēst
            </Button>}
          </div>
        </form>
      </div>
    </Modal>
  )
}
