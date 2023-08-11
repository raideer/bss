import { getStorageItem } from '../global-state/storage.helper'

export const getSettingFromStorage = async (key: string) => {
  const syncStorageValues = await getStorageItem('sync', 'values')
  return syncStorageValues[key]
}
