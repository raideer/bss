
import unique from 'unique-selector'
import md5 from 'js-md5'
import { STORAGE_MEMORY } from '.'
import { getItem, setItem } from 'core/module/settings/storage'

export function saveFilters (filters: {[key: string]: any}) {
  setItem(STORAGE_MEMORY, JSON.stringify(filters))
}

export function getSavedFilters () {
  const data = getItem(STORAGE_MEMORY)

  if (data) {
    return JSON.parse(data)
  }

  return {}
}

export const getCurrentFilterData = (form: HTMLFormElement) => {
  const data: any = {}

  form.querySelectorAll('select, input:not([type="checkbox"]):not([type="submit"]):not([type="button"]):not([class="bss-input"])').forEach((input: any) => {
    data[unique(input)] = input.value
  })

  return data
}

export const getDataHash = (data: any) => {
  return md5(JSON.stringify(data))
}
