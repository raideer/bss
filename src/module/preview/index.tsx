import { whenLoaded } from 'util/lifecycle'
import { getItem, registerSetting, SettingCategory, SettingValueType } from 'module/settings/storage'
import { render } from 'preact'
import { PreviewButton } from './PreviewButton'
import { whenNextPageLoaded } from 'module/infinite-load'

export const SETTING_ENABLED = 'preview-enabled'

registerSetting({
  id: SETTING_ENABLED,
  type: SettingValueType.Checkbox,
  defaultValue: 'true',
  menu: SettingCategory.AdList,
  title: 'Sludinājuma priekšskats',
  description: 'Apskati sludinājuma galeriju no sludinājumu saraksta'
})

function addPreviewButtons () {
  if (getItem(SETTING_ENABLED) !== 'true') return

  document.body.classList.add('ssplus-preview-enabled');

  document.querySelectorAll('tr[id^="tr_"]').forEach(row => {
    // Remove all event listeners
    // eslint-disable-next-line no-self-assign
    // row.outerHTML = row.outerHTML

    const rowTitle = row.querySelector('td.msg2')

    if (rowTitle) {
      render(<PreviewButton row={row} />, rowTitle)
    }
  })
}

whenLoaded(() => {
  addPreviewButtons()
})

whenNextPageLoaded(() => {
  addPreviewButtons()
})
