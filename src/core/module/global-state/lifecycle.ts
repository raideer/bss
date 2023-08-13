import { STORAGE_LOCAL, STORAGE_SYNC, StorageType } from './constants'

type Callback = () => void

const listeners: Record<StorageType, Callback[]> = {
  [STORAGE_LOCAL]: [],
  [STORAGE_SYNC]: []
}

const hydrated: Record<StorageType, boolean> = {
  [STORAGE_LOCAL]: false,
  [STORAGE_SYNC]: false
}

export const whenHydrated = (type: StorageType, callback: Callback) => {
  if (hydrated[type]) {
    return callback()
  }

  listeners[type].push(callback)
}

export const hydrateMiddleware = (_store: any) => (next: any) => (action: any) => {
  if (action.type === 'persist/REHYDRATE') {
    const type = action.key as StorageType

    if (!hydrated[type]) {
      hydrated[type] = true
      listeners[type].forEach((callback) => setTimeout(callback, 0))
    }
  }

  return next(action)
}
