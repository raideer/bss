import { createAsyncThunk } from '@reduxjs/toolkit'
import browser from 'webextension-polyfill'
import { Setting } from '../types'
import { SettingsState } from './settings.slice'
import { log } from 'util/logger'

export const loadSettings = createAsyncThunk('settings/load', () => {
  return browser.storage.sync.get()
})

export const updateSetting = createAsyncThunk('settings/update', async (payload: { id: string, value: any }) => {
  // No await - optimistic update
  browser.storage.sync.set({
    [payload.id]: payload.value
  })

  log(`Updated setting '${payload.id}' to '${payload.value}'`)

  return payload
})

export const registerSetting = createAsyncThunk('settings/register', async (payload: Setting & { menu: string, defaultValue: any }, api) => {
  const state: any = api.getState()

  const { menu, defaultValue, ...values } = payload

  const setting = (state.settings as SettingsState).settings.find(setting => setting.id === menu)

  if (setting) {
    const data = await browser.storage.sync.get([values.id])

    if (data[values.id] === undefined) {
      api.dispatch(updateSetting({
        id: values.id,
        value: defaultValue
      }))

      log(`Registered default value '${defaultValue}' for setting '${values.id}'`)
    }

    return {
      menu,
      values
    }
  }

  return null
})
