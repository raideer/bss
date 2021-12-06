export function log (message: string) {
  console.log(`%c[BSS ${BSS.version.toString()}]`, 'color: green;', message)
}

export function error (message: string) {
  console.error(`%c[BSS ${BSS.version.toString()}]`, 'color: red;', message)
}
