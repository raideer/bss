import { Button } from 'core/components/Button'
import { Modal } from 'core/components/Modal'
import { FC, useMemo } from 'react'
import { getCurrentFilterParams, filterParamsToId, applyFilter } from '../common'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { FilterForm } from './FilterForm'
import { getFormInputs } from '../form'
import slugify from 'slugify'
import { FilterPreset } from '../types'
import { addPreset, deletePreset } from '../state/filter.slice'

interface Props {
  preset?: FilterPreset;
  visible: boolean;
  onClose: () => void;
}

export const FilterModal: FC<Props> = ({ preset, visible, onClose }) => {
  const dispatch = useDispatch<any>()
  const form = useMemo(() => {
    return document.querySelector('#filter_frm') as HTMLFormElement
  }, [])

  // Converts form inputs to a common format
  const filterInputs = useMemo(() => {
    if (preset) {
      return preset.filters
    }

    return getFormInputs(form)
  }, [preset, form])

  const simpleInputs = useMemo(() => {
    return filterInputs.filter((filter) => {
      return filter.inputs.every(input => input.type !== 'select' || !input.changesPage)
    })
  }, [filterInputs])

  const filterParams = useMemo(() => {
    return getCurrentFilterParams(preset)
  }, [preset, form])

  // Initial modal form values
  const initialValues = {
    name: preset?.name || '',
    notifications: preset?.notifications || false,
    params: filterParams
  }

  const methods = useForm({
    values: initialValues
  })

  const { register, handleSubmit, formState: { errors } } = methods

  const handleSave = async (values: typeof initialValues) => {
    // Unslugify params
    const params: Record<string, string> = {}
    const formData = new FormData(form)
    formData.forEach((value, key) => {
      const slug = slugify(key)
      params[key] = values.params[slug]
    })

    const newPreset: FilterPreset = {
      id: filterParamsToId(params),
      params: params,
      notifications: values.notifications,
      name: values.name,
      path: window.location.pathname,
      filters: filterInputs
    }

    // Delete old preset if it exists
    if (preset) {
      dispatch(deletePreset(preset.id))
    }

    // Save
    dispatch(addPreset(newPreset))

    if (newPreset.id !== filterParamsToId(filterParams)) {
      applyFilter(newPreset)
    }

    onClose()
  }

  const handleDelete = () => {
    if (!preset) {
      return
    }

    dispatch(deletePreset(preset.id))
    onClose()
  }

  return (
    <Modal visible={visible} title={preset ? 'Filtra iestatījumi' : 'Jauns filtrs'} onClose={onClose}>
      <div className="bss-form-control">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleSave)}>
            <div className="bss-form-control">
              <label htmlFor="filter-name" className="bss-label">
                <span className="label-text">Filtra nosaukums:</span>
              </label>
              <input {...register('name', { required: true })} id="filter-name" className="bss-input" />
              {errors.name && <span className='mt-10'>Lūdzu ievadi nosaukumu</span>}
            </div>

            <div className='mt-20'>
              <FilterForm filters={simpleInputs} />
            </div>

            <div className="bss-form-control mt-20">
              <label className="bss-label">
                <span className="label-text">Ieslēgt paziņojumus:</span>
                <input type='checkbox' {...register('notifications')} className="bss-checkbox" />
              </label>
              <span className="bss-label-text-alt">Automātiski saņem pārlūka paziņojumus par jauniem sludinājumiem, kas atbilst šim filtram</span>
            </div>

            <div className="w-full flex justify-between mt-20">
              <Button type="submit" size="md" variant="accent">
                Saglabāt
              </Button>
              {preset && <Button onClick={handleDelete} size="md" variant="neutral">
                Dzēst
              </Button>}
            </div>
            </form>
        </FormProvider>
      </div>
    </Modal>
  )
}
