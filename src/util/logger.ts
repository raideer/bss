import { BSS } from 'core/bss'

export function log (message: string) {
  console.log(`%c[BSS ${BSS.version.full}]`, 'color: green;', message)
}

export function error (message: string) {
  console.error(`%c[BSS ${BSS.version.full}]`, 'color: red;', message)
}
