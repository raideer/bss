import localStorage from './local-storage'
import syncStorage from './sync-storage'

export const getStorageItem = async (storage: 'local' | 'sync', key: string) => {
  const data = await getPersistStorage(storage)
  const parsedData = JSON.parse(data)
  return parsedData[key] ? JSON.parse(parsedData[key]) : null
}

const getPersistStorage = (storage: 'local' | 'sync') => {
  if (storage === 'local') {
    return localStorage.getItem('persist:bss-local')
  }

  return syncStorage.getItem('persist:bss-sync')
}
