import { log } from 'util/logger';
import browser from 'webextension-polyfill'

log('Style blocker loaded')

browser.webRequest.onBeforeRequest.addListener(() => {
  log('Blocked style.css')

  return {
    cancel: true
  }
}, {
  urls: [
    'https://i.ss.com/w_inc/style.css*',
    'https://i.ss.lv/w_inc/style.css*'
  ],
  types: [
    'stylesheet'
  ]
}, ['blocking']);
