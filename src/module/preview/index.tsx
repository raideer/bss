import { whenLoaded } from 'util/lifecycle'
import { getItem, registerSetting, SettingCategory, SettingValueType } from 'module/settings/storage'
import { render } from 'preact'
import { PreviewButton } from './PreviewButton'
import { whenNextPageLoaded } from 'module/infinite-load'
import { AdType, getPageInfo } from 'util/page-info'

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
  const pageInfo = getPageInfo()

  document.body.classList.add('ssplus-preview-enabled');

  document.querySelectorAll('[id^="tr_"]').forEach(row => {
    const rowTitle = pageInfo.adType !== AdType.AD_TYPE_GALLERY
      ? row.querySelector('td.msg2')
      : row.querySelector('.d7, .d7p')

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
