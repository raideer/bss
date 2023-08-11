type Callback = () => void

const persistListeners: Callback[] = []

let persisted = false

export const whenPersisted = (callback: Callback) => {
  if (persisted) {
    return callback()
  }

  persistListeners.push(callback)
}

export const persistMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.key === 'bss-sync' && action.type === 'persist/REHYDRATE' && !persisted) {
    persisted = true
    persistListeners.forEach((callback) => setTimeout(callback, 0))
  }

  return next(action)
}
