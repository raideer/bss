import { getSetting, registerSetting, subscribeToSetting } from 'core/module/settings'
import { SettingCategory, SettingValueType } from 'core/module/settings/types'
import { whenLoaded, whenStarting } from 'util/lifecycle'

const THEMES = [
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
]

registerSetting({
  id: 'theme',
  type: SettingValueType.Select,
  defaultValue: 'light',
  options: THEMES,
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

const updateTheme = (theme: string) => {
  const themes = THEMES.map(theme => `bss-theme-${theme.value}`)
  document.documentElement.classList.remove('bss-theme', ...themes)

  if (theme === 'original') {
    return
  }

  document.documentElement.classList.add('bss-theme', `bss-theme-${theme}`)
}

whenStarting(() => {
  const theme = getSetting('theme')
  updateTheme(theme)
  subscribeToSetting('theme', updateTheme)
})

whenLoaded(() => {
  removeInlineColors()
})
