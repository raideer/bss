export function log (message: string) {
  console.log('%c[SS Plus]', 'color: green;', message)
}

export function error (message: string) {
  console.error('%c[SS Plus]', 'color: red;', message)
}
