import { getItem, registerSetting, SettingCategory, SettingValueType } from 'module/settings/storage'
import { PreviewButton } from './PreviewButton'
import { addButton } from 'core/module/button-container'

export const SETTING_ENABLED = 'preview-enabled'

registerSetting({
  id: SETTING_ENABLED,
  type: SettingValueType.Checkbox,
  defaultValue: 'true',
  menu: SettingCategory.AdList,
  title: 'Sludinājuma priekšskats',
  description: 'Apskati sludinājuma galeriju no sludinājumu saraksta'
})

addButton((row: Element) => {
  if (getItem(SETTING_ENABLED) !== 'true') return
  document.body.classList.add('bss-preview-enabled');

  return <PreviewButton row={row} />
})
