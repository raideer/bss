import { SettingCategory, SettingValueType, getItem, registerSetting, setItem } from "module/settings/storage"
import { whenLoaded } from "util/lifecycle"
import { log } from "util/logger"
import Cookies from 'js-cookie'
import browser from 'webextension-polyfill'

export const SETTING_ENABLED = 'memo-sync-enabled'

registerSetting({
  id: SETTING_ENABLED,
  type: SettingValueType.Checkbox,
  defaultValue: 'true',
  menu: SettingCategory.Other,
  title: 'Sesijas sinhronizācija',
  description: 'Tava ss.com sesija (memo un vēsture) tiks sinhronizēta starp ierīcēm.'
})

whenLoaded(async () => {
  if (await getItem(SETTING_ENABLED) !== 'true') return

  const sessionId = await getItem('ss-session')
  const sid = Cookies.get('sid')

  if (!sessionId) {
    setItem('ss-session', sid)
    return
  }

  if (sessionId !== sid) {
    Cookies.set('sid', sessionId, { path: '/', domain: `.${window.location.host}` })
    log('Reloading page to apply saved session...')
    window.location.reload()
  }
})
