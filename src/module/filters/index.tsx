import { dom } from 'util/dom'
import { whenLoaded } from 'util/lifecycle'
import { SettingCategory, SettingValueType } from 'core/module/settings/types'
import { renderReact } from 'util/react'
import { Filters } from './components/Filters'
import { getSetting, registerSetting } from 'core/module/settings'
import { SETTING_ENABLED, SETTING_NOTIFICATIONS_ENABLED, SETTING_NOTIFICATION_INTERVAL, STORAGE_MEMORY, SW_FILTERS_NEW } from './constants'
import { addHtbElement } from 'core/containers/htb-container'
import { HomeFilterList } from './components/HomeFilterList'
import { StateProvider } from 'core/module/global-state/Provider'
import { FilterPreset } from './types'
import { applyFilter, filterParamsToId, getCurrentFilterParams } from './common'
import { getStorageItem } from 'core/module/global-state/storage.helper'
import localStorage from 'core/module/global-state/local-storage'
import { isListingPage } from 'util/page-info'

registerSetting({
  id: SETTING_ENABLED,
  type: SettingValueType.Checkbox,
  defaultValue: true,
  needsReload: true,
  menu: SettingCategory.Filters,
  title: 'Filtri',
  description: 'Saglabā un uzstādi filtrus ar 1 klikšķi'
})

registerSetting({
  id: SETTING_NOTIFICATIONS_ENABLED,
  type: SettingValueType.Checkbox,
  defaultValue: true,
  needsReload: true,
  menu: SettingCategory.Filters,
  title: 'Sludinājumu paziņojumi',
  description: 'Saņem paziņojumus par jauniem sludinājumiem, kas atbilst filtram'
})

registerSetting({
  id: SETTING_NOTIFICATION_INTERVAL,
  type: SettingValueType.Select,
  defaultValue: '30',
  needsReload: true,
  options: [
    { value: '5', label: 'Reizi 5 minūtēs' },
    { value: '15', label: 'Reizi 15 minūtēs' },
    { value: '30', label: 'Reizi 30 minūtēs' },
    { value: '60', label: 'Reizi 60 minūtēs' },
    { value: '120', label: 'Reizi 2 stundās' },
    { value: '240', label: 'Reizi 4 stundās' },
    { value: '480', label: 'Reizi 6 stundās' },
    { value: '960', label: 'Reizi 12 stundās' },
    { value: '1920', label: 'Reizi dienā' }
  ],
  menu: SettingCategory.Filters,
  title: 'Paziņojumu intervāls',
  description: 'Cik bieži pārbaudīt jaunus sludinājumus. Lai stātos spēkā, nepieciešams aizvērt un atvērt interneta pārlūku'
})

const renderFilters = () => {
  const filterForm = document.querySelector('#filter_frm') as HTMLFormElement

  if (!filterForm) {
    return
  }

  const container = dom('div', { class: 'bss-fm' })
  filterForm.prepend(container)
  renderReact(<StateProvider><Filters /></StateProvider>, container)
}

const applyUrlFilter = async () => {
  const url = new URL(window.location.href)
  const filterId = url.searchParams.get('bss-filter')

  if (filterId) {
    const filters = await getStorageItem('local', STORAGE_MEMORY) || []

    const filter = filters.find((f: FilterPreset) => f.id === filterId)

    if (filter) {
      applyFilter(filter)
      return true
    }
  }

  return false
}

// Add bell icon to new listings
const showNewListings = async () => {
  const currentParams = getCurrentFilterParams()
  const currentId = filterParamsToId(currentParams)

  const presets = (await getStorageItem('local', STORAGE_MEMORY) || []) as FilterPreset[]
  const activePreset = presets.find(preset => currentId === preset.id)

  if (activePreset) {
    const key = `${SW_FILTERS_NEW}/${activePreset.id}`
    const newListings = await localStorage.getItem(key) as string[]

    if (!newListings || !newListings.length) {
      return
    }

    const listings = Array.from(document.querySelectorAll('[id^=tr_]'))

    if (!listings.length) {
      return
    }

    // Find oldest unseen listing and then mark all other as new
    let isNew = false
    listings.reverse().forEach((listing, index) => {
      if (!isNew) {
        const id = listing.id
        isNew = newListings.includes(id)
      }

      if (isNew) {
        const newTag = dom('span', { class: 'bss-fm-new-tag icon-notification' }, '')
        listing.appendChild(newTag)
      }
    })

    localStorage.removeItem(key)
  }
}

addHtbElement(<HomeFilterList key="home-filter-list" />)

whenLoaded(async () => {
  if (!getSetting(SETTING_ENABLED)) return

  const willRedirect = await applyUrlFilter()

  if (!willRedirect) {
    renderFilters()

    if (isListingPage()) {
      showNewListings()
    }
  }
})
