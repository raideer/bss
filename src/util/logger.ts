export function log (message: string) {
  console.log(`%c[SS Plus ${SSPlus.version.toString()}]`, 'color: green;', message)
}

export function error (message: string) {
  console.error(`%c[SS Plus ${SSPlus.version.toString()}]`, 'color: red;', message)
}
