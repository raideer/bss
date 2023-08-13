import { STORAGE_SYNC } from '../global-state/constants'
import { getStorageItem } from '../global-state/storage.helper'

export const getSettingFromStorage = async (key: string) => {
  const syncStorageValues = await getStorageItem(STORAGE_SYNC, 'values')
  return syncStorageValues[key]
}
