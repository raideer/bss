import {
  KEY_PREFIX,
  STORAGE_LOCAL,
  STORAGE_SYNC,
  StorageType
} from './constants'
import localStorage from './local-storage'
import syncStorage from './sync-storage'

export const getStorageItem = async (storage: StorageType, key: string) => {
  const data = await getPersistStorage(storage)

  return data && data[key] ? data[key] : null
}

const getPersistStorage = (storage: StorageType) => {
  if (storage === STORAGE_LOCAL) {
    return localStorage.getItem(`${KEY_PREFIX}${STORAGE_LOCAL}`)
  }

  return syncStorage.getItem(`${KEY_PREFIX}${STORAGE_SYNC}`)
}
