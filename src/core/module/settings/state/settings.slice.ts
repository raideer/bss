import { createSlice } from '@reduxjs/toolkit'

import { Setting } from '../types'
import { log } from 'util/logger'

export interface SettingsState {
  loaded: boolean,
  values: Record<string, any>,
  settings: Setting[]
}

const initialState: SettingsState = {
  loaded: false,
  values: {},
  settings: []
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSetting: (state, action) => {
      log('Updating setting', action.payload.id, 'to', action.payload.value)
      state.values[action.payload.id] = action.payload.value
    },
    registerSetting: (state, action: { payload: Setting }) => {
      const settings = state.settings.filter((setting) => setting.id !== action.payload.id)
      settings.push(action.payload)
      state.settings = settings

      if (state.values[action.payload.id] === undefined) {
        state.values[action.payload.id] = action.payload.defaultValue
      }
    }
  }
})

export const { updateSetting, registerSetting } = settingsSlice.actions

export default settingsSlice.reducer
