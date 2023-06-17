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
  { menu, defaultValue, ...values}: Setting & { menu: string, defaultValue: string }
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

/**
 * Set an item to storage
 * @param id
 * @param value
 * @returns
 */
export function setItem(id: string, value: string) {
  settingCache[id] = value
  log(`Updated setting '${id}' to '${value}'`)
  return localStorage.setItem(`bss_${id}`, value)
}

/**
 * Fetch an item from storage
 * @param id
 * @param force Bypass cache
 * @returns
 */
export function getItem(id: string, force = false) {
  if (!force && settingCache[id]) {
    return settingCache[id]
  }

  const value = localStorage.getItem(`bss_${id}`)
  settingCache[id] = value as string
  return value
}

export function updateCache() {
  settings.forEach(settingCategory => {
    settingCategory.items.forEach(item => {
      getItem(item.id, true)
    })
  })
}
