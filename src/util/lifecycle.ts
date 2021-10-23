export enum Lifecycle {
  End,
  Start,
  Idle
}

export const lifecycleState = {
  status: Lifecycle.Start
}

export type CallbackFunction<A = void> = (...args: any[]) => A

const loadedListeners: CallbackFunction[] = []
const idleListeners: CallbackFunction[] = []

export function whenLoaded (callback: CallbackFunction) {
  if (lifecycleState.status === Lifecycle.End || lifecycleState.status === Lifecycle.Idle) {
    return callback()
  }

  loadedListeners.push(callback)
}

export function whenIdle (callback: CallbackFunction) {
  if (lifecycleState.status === Lifecycle.Idle) {
    return callback()
  }

  idleListeners.push(callback)
}

document.addEventListener('DOMContentLoaded', () => {
  lifecycleState.status = Lifecycle.End

  loadedListeners.forEach(callback => callback())
})

window.addEventListener('load', () => {
  lifecycleState.status = Lifecycle.Idle

  idleListeners.forEach(callback => callback())
})
