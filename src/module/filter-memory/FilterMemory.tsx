import { Button } from "core/components/Button"
import { useEffect, useState } from "preact/hooks"
import { getLocationPath } from "util/page-info"
import { saveFilters, getSavedFilters } from "."
import take from 'lodash-es/take'
import unique from 'unique-selector'
import md5 from 'js-md5'
import clsx from "clsx"

export const FilterMemory = () => {
  const [presets, setPresets] = useState<any[]>([])
  const savedFilters = getSavedFilters()
  const pageInfo = take(getLocationPath().filter((part: string) => !['filter'].includes(part)), 2)
  const saveKey = pageInfo.join('_')

  const getCurrentFilterData = (form: HTMLFormElement) => {
    const data: any = {}

    form.querySelectorAll('select, input:not([type="checkbox"]):not([type="submit"]):not([type="button"])').forEach((input: any) => {
      data[unique(input)] = input.value
    })

    return data
  }

  const getDataHash = (data: any) => {
    return md5(JSON.stringify(data))
  }

  const saveCurrentFilters = () => {
    const form = document.querySelector('#filter_frm') as HTMLFormElement

    if (form) {
      const path = document.location.pathname
      const data = getCurrentFilterData(form)

      const name = prompt('Ievadi iestatījuma nosaukumu:')

      if (!name) return;

      if (savedFilters[saveKey]) {
        savedFilters[saveKey][name] = {
          data,
          path,
          id: getDataHash(data)
        }
      } else {
        savedFilters[saveKey] = {
          [name]: {
            data,
            path,
            id: getDataHash(data)
          }
        }
      }

      saveFilters(savedFilters)
      renderPresets()
    }
  }

  const applyFilter = (filter: any, noRedirect = false) => {
    if (!noRedirect && filter.path !== document.location.pathname) {
      localStorage.setItem('bss-mem', JSON.stringify(filter))
      window.location.href = filter.path;
      return
    }

    const form = document.querySelector('#filter_frm') as HTMLFormElement

    if (form) {
      for (const key in filter.data) {
        const input = form.querySelector(key) as HTMLInputElement

        if (input) {
          input.value = filter.data[key]
        }
      }

      form.submit()
    }
  }

  const deleteFilter = (key: string) => {
    if (savedFilters[saveKey]) {
      delete savedFilters[saveKey][key]
      saveFilters(savedFilters)
      renderPresets()
    }
  }

  const renderPresets = () => {
    const toApply = localStorage.getItem('bss-mem')
    if (toApply) {
      const data = JSON.parse(toApply)
      localStorage.removeItem('bss-mem')
      return applyFilter(data, true)
    }

    const form = document.querySelector('#filter_frm') as HTMLFormElement
    const currentHash = getDataHash(getCurrentFilterData(form))

    const items: any[] = []

    if (savedFilters[saveKey]) {
      for (const name in savedFilters[saveKey]) {
        const isActive = currentHash === savedFilters[saveKey][name].id

        items.push((
          <div className={clsx({
            'bss-fm-preset': true
          })}>
            <Button active={isActive} variant={isActive ? 'accent' : "neutral"} onClick={() => { applyFilter(savedFilters[saveKey][name]) }} >{name}</Button>
            <Button active={isActive} variant={isActive ? 'accent' : "neutral"} onClick={() => { deleteFilter(name) }}>x</Button>
          </div>
        ))
      }
    }

    setPresets(items)
  }

  useEffect(() => {
    renderPresets()
  }, [])

  return (
    <div className="bss-fm-container">
      <div className="bss-fm-presets">
        {presets}
      </div>
      <Button variant="neutral" className="bss-fm-btn" onClick={saveCurrentFilters}>Saglabāt filtrus</Button>
    </div>
  )
}
