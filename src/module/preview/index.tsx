import { addButton } from 'core/containers/button-container'
import { PreviewButton } from './components/PreviewButton'
import { getSetting, registerSetting, subscribeToSetting } from 'core/module/settings'
import { SettingCategory, SettingValueType } from 'core/module/settings/types'
import { whenLoaded } from 'util/lifecycle'

export const SETTING_ENABLED = 'preview-enabled'

registerSetting({
  id: SETTING_ENABLED,
  type: SettingValueType.Checkbox,
  defaultValue: true,
  menu: SettingCategory.AdList,
  title: 'Sludinājuma priekšskats',
  description: 'Apskati sludinājuma galeriju no sludinājumu saraksta'
})

const addClass = (enabled = true) => {
  if (enabled) {
    document.body.classList.add('bss-preview-enabled')
  } else {
    document.body.classList.remove('bss-preview-enabled')
  }
}

addButton((row: Element) => {
  addClass(getSetting(SETTING_ENABLED))

  return <PreviewButton key="preview-button" row={row} />
})

whenLoaded(() => {
  subscribeToSetting(SETTING_ENABLED, addClass)
})
