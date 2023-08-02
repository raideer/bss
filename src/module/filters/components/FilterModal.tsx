import { Button } from 'core/components/Button'
import { Modal } from 'core/components/Modal'
import { FC } from 'react'
import { getCurrentFilterData, getDataHash, getSavedFilters, saveFilters } from '../common'
import { get, take } from 'lodash-es'
import { getLocationPath } from 'util/page-info'
import { useForm } from 'react-hook-form'
import { error } from 'util/logger'

interface Props {
  filter: string | null;
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const FilterModal: FC<Props> = ({ filter, visible, onClose, onSave }) => {
  const pageInfo = take(getLocationPath().filter((part: string) => !['filter'].includes(part)), 2)
  const saveKey = pageInfo.join('_')
  const savedFilters = getSavedFilters()
  const existingFilter = filter && get(savedFilters, `${saveKey}.${filter}`)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: filter,
      notifications: !!existingFilter?.notifications
    }
  })

  const saveAndClose = (savedFilters: any) => {
    saveFilters(savedFilters)
    setTimeout(() => onSave(), 100)
    onClose()
  }

  const saveCurrentFilters = async (values: any) => {
    const savedFilters = await getSavedFilters()
    const form = document.querySelector('#filter_frm') as HTMLFormElement

    if (!form) {
      error('Filter form not found')
      return
    }

    const path = document.location.pathname
    const data = getCurrentFilterData(form)
    const formData = new URLSearchParams((new FormData(form) as any))

    if (!savedFilters[saveKey]) {
      savedFilters[saveKey] = {}
    }

    if (filter) {
      delete savedFilters[saveKey][filter]
    }

    savedFilters[saveKey][values.name] = {
      data,
      formData: formData.toString(),
      path,
      notifications: !!values.notifications,
      id: getDataHash(data)
    }

    saveAndClose(savedFilters)
  }

  const deleteFilter = async () => {
    const savedFilters = await getSavedFilters()

    if (filter && savedFilters[saveKey]) {
      delete savedFilters[saveKey][filter]
      saveAndClose(savedFilters)
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
