
import unique from 'unique-selector'
import md5 from 'js-md5'
import { STORAGE_MEMORY } from '.'
import store from 'core/module/global-state/store'
import { updateSetting } from 'core/module/settings/state/settings.thunk'
import { getSetting } from 'core/module/settings'

export function saveFilters (filters: {[key: string]: any}) {
  store.dispatch(
    updateSetting({
      id: STORAGE_MEMORY,
      value: filters
    })
  )
}

export function getSavedFilters () {
  const data = getSetting(STORAGE_MEMORY)

  if (data) {
    return data
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
