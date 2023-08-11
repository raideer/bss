import browser from 'webextension-polyfill'

const getItem = (key: string) => {
  return browser.storage.local.get(key).then((value) => value[key])
}

const removeItem = (key: string) => {
  return browser.storage.local.remove(key)
}

const setItem = (key: string, value: any) => {
  return browser.storage.local.set({ [key]: value })
}

export default {
  getItem,
  removeItem,
  setItem
}
