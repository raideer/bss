import { FC } from 'react'
import { Filter } from '../types'
import { useFormContext } from 'react-hook-form'
import slugify from 'slugify'

interface Props {
  filters: Filter[]
}

interface FilterProps {
  filter: Filter
}

const FilterField: FC<FilterProps> = ({ filter }) => {
  const { register } = useFormContext()

  return <div className='bss-form-control'>
    <label className="bss-label">
      {filter.title}
    </label>
    <div className="bss-filter-inputs">
      {filter.inputs.map(input => {
        const slug = slugify(input.name)
        const fieldName = `params.${slug}`

        if (input.type === 'select') {
          return <div key={slug}>
            <select {...register(fieldName)} className="bss-input w-full">
              {input.values.map(value => <option key={value.name} value={value.value}>{value.name}</option>)}
            </select>
          </div>
        }

        return <input {...register(fieldName)} className="bss-input" key={slug} type={input.type} />
      })}
    </div>
  </div>
}

export const FilterForm: FC<Props> = ({ filters }) => {
  return <div className='bss-filters-form'>
    {filters.map(filter => <FilterField key={filter.title} filter={filter} />)}
  </div>
}
