import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { FilterPreset } from '../types'

export interface FilterState {
  presets: FilterPreset[]
}
const initialState: FilterState = {
  presets: []
}

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    addPreset: (state, action: PayloadAction<FilterPreset>) => {
      const presets = state.presets.filter((preset) => preset.id !== action.payload.id)
      presets.push(action.payload)
      state.presets = presets
    },
    deletePreset: (state, action: PayloadAction<FilterPreset['id']>) => {
      state.presets = state.presets.filter((preset) => preset.id !== action.payload)
    }
  }
})

export const { addPreset, deletePreset } = filterSlice.actions

export default filterSlice.reducer
