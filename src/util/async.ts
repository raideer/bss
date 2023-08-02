/**
 * Keep repeating until callback returns true
 * @param callback
 * @param interval
 * @returns
 */
export function waitFor<T> (callback: () => T, interval: number = 1): Promise<T> {
  return new Promise(resolve => {
    (function repeat () {
      const val = callback()

      if (!val) {
        setTimeout(repeat, interval)
        return
      }

      resolve(val)
    })()
  })
}

/**
 * Timeout as a promise
 * @param time
 * @returns
 */
export const timeout = async (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
