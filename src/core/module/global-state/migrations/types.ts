import { GlobalState } from '../store'

export interface Migration {
  name: string
  version: number
  migrate: (state: GlobalState) => Promise<GlobalState>
}
