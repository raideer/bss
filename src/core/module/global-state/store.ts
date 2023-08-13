import { applyMiddleware, combineReducers, configureStore } from '@reduxjs/toolkit'
import settingsReducer from '../settings/state/settings.slice'
import memoReducer from 'module/memo/state/memo.slice'
import filterReducer from 'module/filters/state/filter.slice'
import { persistStore, persistReducer } from 'redux-persist'
import localStorage from './local-storage'
import syncStorage from './sync-storage'
import { hydrateMiddleware } from './lifecycle'
import { KEY_PREFIX, STORAGE_LOCAL, STORAGE_SYNC } from './constants'
import { isString } from 'lodash-es'
import { log } from 'util/logger'

const serialize = (data: any) => {
  return data
}

const deserialize = (data: any) => {
  if (isString(data)) {
    try {
      const parsedData = JSON.parse(data)
      log('Parsed data', parsedData)
      return parsedData
    } catch (e) {
      log('Error parsing data', e)
    }
  }

  return data
}

const commonConfig = {
  serialize: serialize as any,
  deserialize: deserialize as any,
  keyPrefix: KEY_PREFIX,
  version: 1
  // migrate: runMigrations
}

const localPersistConfig = {
  key: STORAGE_LOCAL,
  storage: localStorage,
  ...commonConfig
}

const syncPersistConfig = {
  key: STORAGE_SYNC,
  storage: syncStorage,
  ...commonConfig
}

const rootReducer = combineReducers({
  filter: persistReducer(localPersistConfig, filterReducer),
  memo: persistReducer(localPersistConfig, memoReducer),
  settings: persistReducer(syncPersistConfig, settingsReducer)
})

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
  enhancers: [applyMiddleware(hydrateMiddleware)]
})

export const persistor = persistStore(store)

export type GlobalState = ReturnType<typeof store.getState>

export default store
