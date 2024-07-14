import { notifyNewListings } from 'module/filters/service-worker'
import browser from 'webextension-polyfill'

browser.alarms.onAlarm.addListener((alarm) => {
  switch (alarm.name) {
    case 'notify-new-listings':
      notifyNewListings()
  }
})

notifyNewListings()
