import { BSS } from 'core/bss'

export function log (...messages: any[]) {
  console.log(`%c[BSS ${BSS.version.full}]`, 'color: green;', ...messages)
}

export function error (...messages: any[]) {
  console.error(`%c[BSS ${BSS.version.full}]`, 'color: red;', ...messages)
}
