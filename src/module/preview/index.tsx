import { PreviewButton } from './components/PreviewButton'
import { addButton } from 'core/module/button-container'
import store from 'core/module/global-state/store'
import { getSetting } from 'core/module/settings'
import { registerSetting } from 'core/module/settings/state/settings.thunk'
import { SettingCategory, SettingValueType } from 'core/module/settings/types'

export const SETTING_ENABLED = 'preview-enabled'

store.dispatch(
  registerSetting({
    id: SETTING_ENABLED,
    type: SettingValueType.Checkbox,
    defaultValue: true,
    needsReload: true,
    menu: SettingCategory.AdList,
    title: 'Sludinājuma priekšskats',
    description: 'Apskati sludinājuma galeriju no sludinājumu saraksta'
  })
)

addButton((row: Element) => {
  if (!getSetting(SETTING_ENABLED)) return
  document.body.classList.add('bss-preview-enabled')

  return <PreviewButton key="preview-button" row={row} />
})
