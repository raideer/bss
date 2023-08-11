import { waitFor } from './async'
import { waitForChild } from './dom'

export enum Lifecycle {
  End,
  BeforeStart,
  Start,
  Idle
}

export const lifecycleState = {
  status: Lifecycle.BeforeStart
}

export type CallbackFunction<A = void> = (...args: any[]) => A

const startListeners: CallbackFunction[] = []
const loadedListeners: CallbackFunction[] = []
const idleListeners: CallbackFunction[] = []

export function whenStarting (callback: CallbackFunction) {
  if (lifecycleState.status === Lifecycle.Start || lifecycleState.status === Lifecycle.End || lifecycleState.status === Lifecycle.Idle) {
    return callback()
  }

  startListeners.push(callback)
}

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

waitForChild(document.documentElement, 'body').then(() => waitFor(() => document.body, 10)).then(() => {
  lifecycleState.status = Lifecycle.Start

  startListeners.forEach(callback => callback())
})

document.addEventListener('DOMContentLoaded', () => {
  lifecycleState.status = Lifecycle.End

  loadedListeners.forEach(callback => callback())
})

window.addEventListener('load', () => {
  lifecycleState.status = Lifecycle.Idle

  idleListeners.forEach(callback => callback())
})
