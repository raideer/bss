import { getItem, registerSetting, setItem, SettingCategory, SettingValueType } from "module/settings/storage";
import { render } from "preact/compat";
import { dom } from "util/dom";
import { whenLoaded } from "util/lifecycle";
import { FilterMemory } from "./FilterMemory";

export const SETTING_ENABLED = 'preview-enabled'
export const STORAGE_MEMORY = 'bss-filter-mem'

registerSetting({
  id: SETTING_ENABLED,
  type: SettingValueType.Checkbox,
  defaultValue: 'true',
  menu: SettingCategory.AdList,
  title: 'Filtru atmiņa',
  description: 'Saglabā un uzstādi filtrus ar 1 klikšķi'
})

export async function getSavedFilters() {
  const data = await getItem(STORAGE_MEMORY)

  if (data) {
    return JSON.parse(data)
  }

  return {}
}

export function saveFilters(filters: {[key: string]: any}) {
  setItem(STORAGE_MEMORY, JSON.stringify(filters))
}

whenLoaded(async () => {
  if (await getItem(SETTING_ENABLED) !== 'true') return

  const filterForm = document.querySelector('#filter_frm')

  if (!filterForm) {
    return;
  }

  const container = dom('div', { class: 'bss-filter-mem' })

  filterForm.prepend(container)

  render(<FilterMemory />, container)
})
