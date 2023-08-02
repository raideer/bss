import { getItem, registerSetting } from 'core/module/settings/storage'
import { SettingCategory, SettingValueType } from 'core/module/settings/types'
import { whenLoaded, whenStarting } from 'util/lifecycle'

registerSetting({
  id: 'theme',
  type: SettingValueType.Select,
  defaultValue: 'light',
  options: [
    {
      value: 'original',
      label: 'SS.com'
    },
    {
      value: 'light',
      label: 'Light'
    },
    {
      value: 'dark',
      label: 'Dark'
    },
    {
      value: 'lofi',
      label: 'Lofi'
    },
    {
      value: 'synthwave',
      label: 'Synthwave'
    },
    {
      value: 'black',
      label: 'Black'
    },
    {
      value: 'forest',
      label: 'Forest'
    },
    {
      value: 'retro',
      label: 'Retro'
    },
    {
      value: 'valentine',
      label: 'Valentine'
    }
  ],
  menu: SettingCategory.Appearance,
  title: 'Motīvs'
})

const removeInlineColors = () => {
  const elements = document.querySelectorAll('[bgcolor], [background]')

  elements.forEach(el => {
    el.removeAttribute('bgcolor')
    el.removeAttribute('background')
  })
}

whenStarting(() => {
  const theme = getItem('theme')

  if (theme === 'original') {
    return
  }

  document.documentElement.classList.add('bss-theme', `bss-theme-${theme}`)
})

whenLoaded(() => {
  removeInlineColors()
})
