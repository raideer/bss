import { configureStore } from '@reduxjs/toolkit'

import memoReducer from 'module/memo/state/memo.slice'

const store = configureStore({
  reducer: {
    memo: memoReducer
  }
})

export default store
