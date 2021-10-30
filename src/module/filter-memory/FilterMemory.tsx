import { Button } from "core/components/Button"
import { useEffect, useState } from "preact/hooks"
import { getPageInfo } from "util/page-info"
import { saveFilters, getSavedFilters } from "."

export const FilterMemory = () => {
  const [presets, setPresets] = useState([])
  const savedFilters = getSavedFilters()
  const pageInfo = getPageInfo().filter((part: string) => !['filter'].includes(part))
  const saveKey = pageInfo.join('_')

  const saveCurrentFilters = () => {
    const form = document.querySelector('#filter_frm') as HTMLFormElement

    if (form) {
      const formData = new FormData(form)
      const data: any = {}
      formData.forEach((value, key) => {
        data[key] = value
      })

      const name = prompt('Ievadi nosaukumu:')

      if (!name) return;

      if (savedFilters[saveKey]) {
        savedFilters[saveKey][name] = data
      } else {
        savedFilters[saveKey] = {
          [name]: data
        }
      }

      saveFilters(savedFilters)
    }
  }

  const applyFilter = (data: any) => {
    const form = document.querySelector('#filter_frm') as HTMLFormElement

    if (form) {
      for (const key in data) {
        const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement

        if (input) {
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
    }
  }

  const renderPresets = () => {
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

    return items
  }

  return (
    <div>
      <div>
        {renderPresets()}
      </div>
      <Button onClick={saveCurrentFilters} text="Saglabāt pašreizējos filtrus" />
    </div>
  )
}
