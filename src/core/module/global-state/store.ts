import { configureStore } from '@reduxjs/toolkit'

import settingsReducer from '../settings/state/settings.slice'
import memoReducer from 'module/memo/state/memo.slice'

const store = configureStore({
  reducer: {
    settings: settingsReducer,
    memo: memoReducer
  }
})

export type GlobalState = ReturnType<typeof store.getState>

export default store
