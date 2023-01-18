import { getItem, registerSetting, SettingCategory, SettingValueType } from "module/settings/storage"
import { whenStarting } from "util/lifecycle"

registerSetting({
  id: 'dark-mode-enabled',
  type: SettingValueType.Checkbox,
  defaultValue: 'false',
  menu: SettingCategory.Appearance,
  title: 'Nakts režīms'
})

whenStarting(async () => {
  if (await getItem('dark-mode-enabled') !== 'true') return

  document.body.classList.add('bss-dark');
})
