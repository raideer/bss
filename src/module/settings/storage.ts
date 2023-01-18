import { log } from 'util/logger'

import browser from 'webextension-polyfill'

const settingCache: { [key: string]: string } = {}

export enum SettingValueType {
  Checkbox
}

export const SettingCategory = {
  AdList: 'ad-list',
  Appearance: 'appearance',
  Other: 'other'
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
  },
  {
    id: SettingCategory.Appearance,
    title: 'Izskats',
    items: []
  },
  {
    id: SettingCategory.Other,
    title: 'Citi',
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

export const registerSetting = async (
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
export function setItem(id: string, value: string) {
  settingCache[id] = value
  log(`Updated setting '${id}' to '${value}'`)
  return browser.storage.local.set({ [id]: value })
}

/**
 * Fetch an item from storage
 * @param id
 * @param force Bypass cache
 * @returns
 */
export async function getItem(id: string, force = false) {
  if (!force && settingCache[id]) return settingCache[id]

  const items = await browser.storage.local.get(id)
  settingCache[id] = items[id]
  return items[id]
}

export function updateCache() {
  settings.forEach(settingCategory => {
    settingCategory.items.forEach(item => {
      getItem(item.id, true)
    })
  })
}

updateCache()
