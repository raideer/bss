import { getItem, registerSetting } from "module/settings/storage"
import { SettingCategory, SettingValueType } from "module/settings/types"
import { whenStarting } from "util/lifecycle"

registerSetting({
  id: 'dark-mode-mode',
  type: SettingValueType.Select,
  defaultValue: 'system',
  options: [
    {
      value: 'system',
      label: 'Izmantot sistēmas iestatījumus'
    },
    {
      value: 'enabled',
      label: 'Ieslēgts'
    },
    {
      value: 'disabled',
      label: 'Izslegts'
    }
  ],
  menu: SettingCategory.Appearance,
  title: 'Nakts režīms'
})

const prefersDarkMode = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const registerDarkModeWatcher = (callback: (darkMode: boolean) => void) => {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    callback(event.matches)
  });
}

whenStarting(() => {
  const mode = getItem('dark-mode-mode')

  switch (mode) {
    case 'system':
      if (prefersDarkMode()) {
        document.body.classList.add('bss-dark')
      }

      registerDarkModeWatcher(darkMode => {
        if (darkMode) {
          document.body.classList.add('bss-dark')
        } else {
          document.body.classList.remove('bss-dark')
        }
      })

      break;
    case 'enabled':
      document.body.classList.add('bss-dark');
      break;
  }
})
