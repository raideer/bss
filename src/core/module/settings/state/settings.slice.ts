import { createSlice } from '@reduxjs/toolkit'

import { SettingCategory, SettingsCategory } from '../types'
import { loadSettings, registerSetting, updateSetting } from './settings.thunk'

export interface SettingsState {
  loaded: boolean,
  values: Record<string, any>,
  settings: SettingsCategory[]
}

const initialState: SettingsState = {
  loaded: false,
  values: {},
  settings: [
    {
      id: SettingCategory.AdList,
      title: 'Sludinājumu saraksts',
      items: []
    },
    {
      id: SettingCategory.Appearance,
      title: 'Izskats',
      items: []
    },
    {
      id: SettingCategory.Filters,
      title: 'Filtri',
      items: []
    },
    {
      id: SettingCategory.Search,
      title: 'Kategoriju meklētājs',
      items: []
    }
  ]
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(loadSettings.fulfilled, (state, action) => {
      for (const id in action.payload) {
        state.values[id] = action.payload[id]
      }

      state.loaded = true
    })

    builder.addCase(updateSetting.fulfilled, (state, action) => {
      state.values[action.payload.id] = action.payload.value
    })

    builder.addCase(registerSetting.fulfilled, (state, action) => {
      if (!action.payload) {
        return
      }

      const setting = state.settings.find(setting => setting.id === action.payload!.menu)

      if (setting) {
        setting.items.push({
          ...action.payload!.values
        })
      }
    })
  }
})

export default settingsSlice.reducer
