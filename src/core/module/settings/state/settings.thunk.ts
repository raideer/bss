import { createAsyncThunk } from '@reduxjs/toolkit'
import browser from 'webextension-polyfill'
import { Setting } from '../types'
import { SettingsState, updateSetting } from './settings.slice'
import { log } from 'util/logger'

export const registerSetting = createAsyncThunk('settings/register', async (payload: Setting & { menu: string, defaultValue: any }, api) => {
  // await runMigrations()

  const state: any = api.getState()

  const { menu, defaultValue, ...values } = payload

  const setting = (state.settings as SettingsState).settings.find(setting => setting.id === menu)

  if (setting) {
    const storage = await browser.storage.sync.get(['persist:bss'])
    const data = JSON.parse(storage['persist:bss'])
    const settings = JSON.parse(data.settings)

    if (settings.values[values.id] === undefined) {
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
