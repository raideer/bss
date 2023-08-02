import browser from 'webextension-polyfill'
import { log } from 'util/logger'
import { Setting, SettingCategory, SettingsCategory } from './types'

const settingCache: { [key: string]: string } = {}

const settings: SettingsCategory[] = [
  {
    id: SettingCategory.AdList,
    title: 'Sludinājumu saraksts',
    items: []
  },
  {
    id: SettingCategory.Appearance,
    title: 'Izskats',
    items: []
  },
  {
    id: SettingCategory.Filters,
    title: 'Filtri',
    items: []
  },
  {
    id: SettingCategory.Search,
    title: 'Kategoriju meklētājs',
    items: []
  }
]

/**
 * Get all settings
 *
 * @returns SettingsCategory[]
 */
export const getSettings = () => {
  return settings
}

export const registerSetting = (
  { menu, defaultValue, ...values }: Setting & { menu: string, defaultValue: string }
) => {
  const setting = settings.find(setting => setting.id === menu)

  if (setting) {
    const hasValue = getItem(values.id)

    if (!hasValue) {
      setItem(values.id, defaultValue)
      log(`Registered default value '${defaultValue}' for setting '${values.id}'`)
    }

    setting.items.push({
      ...values
    })
  }
}

function setItemLocal (id: string, value: string) {
  settingCache[id] = value
  return localStorage.setItem(`bss_${id}`, value)
}
/**
 * Set an item to storage
 * @param id
 * @param value
 * @returns
 */
export function setItem (id: string, value: string) {
  log(`Updated setting '${id}' to '${value}'`)
  browser.storage.sync.set({ [`bss_${id}`]: value })
  return setItemLocal(id, value)
}

/**
 * Fetch an item from storage
 * @param id
 * @param force Bypass cache
 * @returns
 */
export function getItem (id: string, force = false) {
  if (!force && settingCache[id]) {
    return settingCache[id]
  }

  const value = localStorage.getItem(`bss_${id}`)
  settingCache[id] = value as string
  return value
}

export async function migrateToStorage () {
  const items = await browser.storage.sync.get()

  if (Object.keys(items).length === 0) {
    settings.forEach(settingCategory => {
      settingCategory.items.forEach(item => {
        const value = getItem(item.id, true)

        if (value) {
          setItem(item.id, value)
        }
      })
    })
  }
}

export async function updateLocalStorage () {
  let updated = false
  const items = await browser.storage.sync.get()

  for (const id in items) {
    const storageVal = items[id]
    const value = localStorage.getItem(id)

    if (value !== storageVal) {
      localStorage.setItem(id, storageVal)
      log(`Updated setting '${id}' to '${storageVal}'`)
      updated = true
    }
  }

  if (updated) {
    window.location.reload()
  }
}
