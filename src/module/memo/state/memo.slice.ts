import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loadMemoItems } from '../common'
import { urlArgs } from 'util/url'

const ADD_ENDPOINT = '/w_inc/add_to_favorites.php?lg={{lang}}&m={{id}}&d={{date}}'
const DELETE_ENDPOINT = '/w_inc/add_to_favorites.php?lg={{lang}}&action=del&m={{id}}&d={{date}}'

export interface MemoState {
  items: string[]
}

const initialState: MemoState = {
  items: []
}

export const fetchMemoItems = createAsyncThunk('memo/fetchMemoItems', async () => {
  return loadMemoItems()
})

export const addToMemo = createAsyncThunk('memo/addToMemo', async (id: string) => {
  await fetch(urlArgs(ADD_ENDPOINT, { id, lang: 'lv', date: String(+new Date()) }), {
    headers: {
      accept: 'message/x-ajax'
    }
  })

  return id
})

export const removeFromMemo = createAsyncThunk('memo/removeFromMemo', async (id: string) => {
  await fetch(urlArgs(DELETE_ENDPOINT, { id, lang: 'lv', date: String(+new Date()) }), {
    headers: {
      accept: 'message/x-ajax'
    }
  })

  return id
})

export const memoSlice = createSlice({
  name: 'memo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMemoItems.fulfilled, (state, action) => {
      state.items = action.payload
    })

    builder.addCase(addToMemo.fulfilled, (state, action) => {
      state.items = [...state.items, action.payload]
    })

    builder.addCase(removeFromMemo.fulfilled, (state, action) => {
      state.items = state.items.filter(i => i !== action.payload)
    })
  }
})

export default memoSlice.reducer
