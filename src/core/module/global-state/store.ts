import { applyMiddleware, combineReducers, configureStore } from '@reduxjs/toolkit'
import settingsReducer from '../settings/state/settings.slice'
import memoReducer from 'module/memo/state/memo.slice'
import filterReducer from 'module/filters/state/filter.slice'
import { persistStore, persistReducer } from 'redux-persist'
import localStorage from './local-storage'
import syncStorage from './sync-storage'
import { persistMiddleware } from './lifecycle'

const localPersistConfig = {
  key: 'bss-local',
  storage: localStorage
}

const syncPersistConfig = {
  key: 'bss-sync',
  storage: syncStorage
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
  enhancers: [applyMiddleware(persistMiddleware)]
})

export const persistor = persistStore(store)

export type GlobalState = ReturnType<typeof store.getState>

export default store
