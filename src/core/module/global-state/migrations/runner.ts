import { log } from 'util/logger'
import { Migration } from './types'
import { PersistMigrate } from 'redux-persist'

const migrations: Migration[] = [
  // migrateSerializedState
]

export const runMigrations: PersistMigrate = async (state: any, currentVersion: number) => {
  log(`Running migrations from version ${currentVersion}`)

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
