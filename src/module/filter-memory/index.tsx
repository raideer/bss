import { getItem, setItem } from "module/settings/storage";
import { render } from "preact/compat";
import { dom } from "util/dom";
import { whenLoaded } from "util/lifecycle";
import { FilterMemory } from "./FilterMemory";

export const STORAGE_KEY = 'ssplus-filter-mem'

export function getSavedFilters() {
  const data = getItem(STORAGE_KEY)

  if (data) {
    return JSON.parse(data)
  }

  return {}
}

export function saveFilters(filters: {[key: string]: string}) {
  setItem(STORAGE_KEY, JSON.stringify(filters))
}

whenLoaded(() => {
  const filterForm = document.querySelector('#filter_frm')

  if (!filterForm) {
    return;
  }

  const container = dom('div', { class: 'ssplus-filter-mem' })

  filterForm.prepend(container)

  render(<FilterMemory />, container)
})
