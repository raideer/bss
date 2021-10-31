import { Button } from "core/components/Button"
import { useEffect, useState } from "preact/hooks"
import { getPageInfo } from "util/page-info"
import { saveFilters, getSavedFilters } from "."
import take from 'lodash-es/take'
import unique from 'unique-selector'

export const FilterMemory = () => {
  const [presets, setPresets] = useState<any[]>([])
  const savedFilters = getSavedFilters()
  const pageInfo = take(getPageInfo().filter((part: string) => !['filter'].includes(part)), 3)
  const saveKey = pageInfo.join('_')

  const saveCurrentFilters = () => {
    const form = document.querySelector('#filter_frm') as HTMLFormElement

    if (form) {
      const data: any = {}

      form.querySelectorAll('select, input:not([type="checkbox"]):not([type="submit"]):not([type="button"])').forEach((input: any) => {
        data[unique(input)] = input.value
      })

      console.log(data, saveKey, savedFilters[saveKey])

      const name = prompt('Ievadi iestatījuma nosaukumu:')

      if (!name) return;

      if (savedFilters[saveKey]) {
        savedFilters[saveKey][name] = data
      } else {
        savedFilters[saveKey] = {
          [name]: data
        }
      }

      saveFilters(savedFilters)
      renderPresets()
    }
  }

  const applyFilter = (data: any) => {
    const form = document.querySelector('#filter_frm') as HTMLFormElement

    if (form) {
      for (const key in data) {
        const input = form.querySelector(key) as HTMLInputElement

        if (input) {
          if (input.getAttribute('name') === 'sid' && data[key] !== document.location.pathname) {
            localStorage.setItem('ssplus-mem', JSON.stringify(data))
            window.location.href = data[key]
            return
          }

          input.value = data[key]
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
    const toApply = localStorage.getItem('ssplus-mem')
    if (toApply) {
      const data = JSON.parse(toApply)
      localStorage.removeItem('ssplus-mem')
      // return applyFilter(data)
    }

    const items: any[] = []

    if (savedFilters[saveKey]) {
      for (const name in savedFilters[saveKey]) {
        items.push((
          <div className="ssplus-filter-preset">
            <Button text={name} onClick={() => { applyFilter(savedFilters[saveKey][name]) }} />
            <Button className="ssplus-filter-preset__remove" text={'x'} onClick={() => { deleteFilter(name) }} />
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
    <div className="ssplus-filter-mem__container">
      <div className="ssplus-filter-presets">
        {presets}
      </div>
      <Button className="ssplus-filter-mem__savebtn" onClick={saveCurrentFilters} text="Saglabāt pašreizējos filtrus" />
    </div>
  )
}
