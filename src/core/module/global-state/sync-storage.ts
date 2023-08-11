import browser from 'webextension-polyfill'

const getItem = (key: string) => {
  return browser.storage.sync.get(key).then((value) => value[key])
}

const removeItem = (key: string) => {
  return browser.storage.sync.remove(key)
}

const setItem = (key: string, value: any) => {
  return browser.storage.sync.set({ [key]: value })
}

export default {
  getItem,
  removeItem,
  setItem
}
