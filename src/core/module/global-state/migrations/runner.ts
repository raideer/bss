import { log } from 'util/logger'
import { Migration } from './types'
import { PersistMigrate } from 'redux-persist'

const migrations: Migration[] = [
  //
]

export const runMigrations: PersistMigrate = async (state: any, currentVersion: number) => {
  const migrationsToRun = migrations.filter(migration => {
    return migration.version === currentVersion
  })

  let newState = state

  for (const migration of migrationsToRun) {
    newState = await migration.migrate(state)
    log(`Ran migration ${migration.name}`)
  }

  return newState
}
