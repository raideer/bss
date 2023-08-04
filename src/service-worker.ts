import { notifyNewListings } from 'module/filters/service-worker'
import browser from 'webextension-polyfill'

browser.alarms.create('notify-new-listings', {
  periodInMinutes: 20
})

browser.alarms.onAlarm.addListener(alarm => {
  switch (alarm.name) {
    case 'notify-new-listings':
      notifyNewListings()
  }
})

notifyNewListings()
