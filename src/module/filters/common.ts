
import unique from 'unique-selector'
import md5 from 'js-md5'
import { mapKeys, memoize, snakeCase, take } from 'lodash-es'
import { getLocationPath } from 'util/page-info'
import { FilterPreset } from './types'
import { dom } from 'util/dom'
import slugify from 'slugify'

export const applyFilter = (filter: FilterPreset) => {
  const form = dom('form', {
    action: filter.path,
    method: 'POST'
  }) as HTMLFormElement

  for (const key in filter.params) {
    const value = filter.params[key]
    const input = dom('input', {
      type: 'hidden',
      name: key,
      value
    })

    form.appendChild(input)
  }

  document.body.appendChild(form)
  form.submit()
}

export const getCurrentFilterParams = (preset?: FilterPreset) => {
  if (preset) {
    return mapKeys(preset.params, (value, key) => {
      return slugify(key)
    })
  }

  const formData = new FormData(document.querySelector('#filter_frm') as HTMLFormElement)

  // Convert form data to object
  const currentFormData: Record<string, string> = {}

  formData.forEach((value, key) => {
    currentFormData[slugify(key)] = value.toString()
  })

  return currentFormData
}

export const getFilterLocationKey = memoize((path?: string) => {
  const pathParts = getLocationPath(path)
  const pageInfo = take(pathParts.filter((part: string) => !['filter'].includes(part)), 2)
  return snakeCase(pageInfo.join('_'))
})

export const getCurrentFilterData = (form: HTMLFormElement) => {
  const data: Record<string, string> = {}

  form.querySelectorAll('select, input:not([type="checkbox"]):not([type="submit"]):not([type="button"]):not([class="bss-input"])').forEach((input: any) => {
    data[unique(input)] = input.value
  })

  return data
}

export const filterParamsToId = (data: FilterPreset['params']) => {
  const values = Object.values(data).sort()
  return md5(JSON.stringify(values))
}
