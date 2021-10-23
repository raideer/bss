import { whenLoaded } from 'util/lifecycle'
import { getCachedItem, registerSetting, SettingCategory, SettingValueType } from 'module/settings/storage'
import { render } from 'preact'
import { GalleryButton } from './GalleryButton'
import { whenNextPageLoaded } from 'module/infinite-load'

registerSetting({
  id: 'gallery-enabled',
  type: SettingValueType.Checkbox,
  defaultValue: 'true',
  menu: SettingCategory.AdList,
  title: 'Galerija',
  description: 'Apskati sludinājuma galeriju no sludinājumu saraksta'
})

function addGalleryButtons () {
  if (getCachedItem('gallery-enabled') === 'false') return

  document.querySelectorAll('tr[id^="tr_"]').forEach(row => {
    // Remove all event listeners
    // eslint-disable-next-line no-self-assign
    // row.outerHTML = row.outerHTML

    const rowTitle = row.querySelector('td.msg2')

    if (rowTitle) {
      render(<GalleryButton row={row} />, rowTitle)
    }
  })
}

whenLoaded(() => {
  addGalleryButtons()
})

whenNextPageLoaded(() => {
  addGalleryButtons()
})
