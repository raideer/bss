import localforage from 'localforage'
import { log } from 'util/logger'

const settingCache: { [key: string]: string } = {}

export enum SettingValueType {
  Checkbox
}

export const SettingCategory = {
  AdList: 'ad-list'
}

export interface Setting {
  type: SettingValueType,
  title: string,
  description?: string,
  id: string
}

export interface SettingsTab {
  id: string;
  title: string;
}

export interface SettingsCategory {
  id: string;
  tab?: SettingsTab,
  title: string;
  items: Setting[];
}

const settings: SettingsCategory[] = [
  {
    id: SettingCategory.AdList,
    title: 'Sludinājumu saraksts',
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
  { id, title, description, type, menu, defaultValue }: Setting & { menu: string, defaultValue: string }
) => {
  const setting = settings.find(setting => setting.id === menu)

  if (setting) {
    getItem(id).then(hasValue => {
      if (!hasValue) {
        setItem(id, defaultValue)
        log(`Registered default value '${defaultValue}' for setting '${id}'`)
      }
    })

    setting.items.push({
      id,
      title,
      description,
      type
    })
  }
}

/**
 * Set an item to storage
 * @param id
 * @param value
 * @returns
 */
export async function setItem(id: string, value: string) {
  settingCache[id] = value
  log(`Updated setting '${id}' to '${value}'`)
  return localforage.setItem(`ssplus_${id}`, value)
}

/**
 * Fetch an item from storage
 * @param id
 * @param force Bypass cache
 * @returns
 */
export async function getItem(id: string, force = false) {
  if (!force && settingCache[id]) {
    return settingCache[id]
  }

  const value = await localforage.getItem(`ssplus_${id}`)
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

export function getCachedItem(id: string) {
  return settingCache[id]
}
