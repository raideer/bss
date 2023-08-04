
import unique from 'unique-selector'
import md5 from 'js-md5'
import { STORAGE_MEMORY } from '.'
import store from 'core/module/global-state/store'
import { updateSetting } from 'core/module/settings/state/settings.thunk'
import { snakeCase, take } from 'lodash-es'
import { getLocationPath } from 'util/page-info'

export function saveFilters (filters: Record<string, any>) {
  const payload = {
    id: STORAGE_MEMORY,
    value: filters
  }

  store.dispatch(updateSetting(payload))
}

export const applyFilter = (filter: any) => {
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

export const getSaveKey = () => {
  const pageInfo = take(getLocationPath().filter((part: string) => !['filter'].includes(part)), 2)
  return snakeCase(pageInfo.join('_'))
}

export const getCurrentFilterData = (form: HTMLFormElement) => {
  const data: Record<string, string> = {}

  form.querySelectorAll('select, input:not([type="checkbox"]):not([type="submit"]):not([type="button"]):not([class="bss-input"])').forEach((input: any) => {
    data[unique(input)] = input.value
  })

  return data
}

export const getDataHash = (data: Record<string, string>) => {
  const values = Object.values(data).sort()
  return md5(JSON.stringify(values))
}
