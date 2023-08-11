import { isString } from 'lodash'
import { uniq } from 'lodash-es'
import { isJson } from 'util/json'
import { log } from 'util/logger'
import browser from 'webextension-polyfill'

interface Migration {
  id: string;
  migrate: () => Promise<void>;
  after?: () => Promise<void>;
  shouldRun?: () => Promise<boolean>;
}

let migrationsRan = false

const migrations: Migration[] = [
  {
    id: 'migrate-local-storage',
    migrate: async () => {
      await Promise.all([
        'bss_bss-filter-mem',
        'bss_infinite-load-enabled',
        // 'bss_filters',
        'bss_memo-button-enabled',
        'bss_memory-notifications-enabled',
        'bss_theme',
        'bss_preview-enabled',
        'bss_memory-enabled',
        'bss_search-enabled'
      ].map(setting => {
        let value = localStorage.getItem(setting)

        if (value) {
          const key = setting.replace('bss_', '')

          if (isString(value) && isJson(value)) {
            value = JSON.parse(value)
          }

          localStorage.removeItem(setting)

          log('Migrating', setting, 'to', key, value!)

          return browser.storage.sync.set({
            [key]: value
          })
        }

        return null
      }))
    },
    after: async () => {
      window.location.reload()
    }
  }
]

export const runMigrations = async () => {
  if (migrationsRan) {
    return
  }

  const shouldRun = migrations.map((migration) => !migration.shouldRun || migration.shouldRun())
  const results = await Promise.all([
    browser.storage.sync.get(['migrations']),
    ...shouldRun
  ])

  const [{ migrations: history }, ...shouldRunResults] = results

  const pastMigrations = history || []

  const migrationsToRun = migrations.filter(
    (m, index) => pastMigrations.indexOf(m.id) === -1 && shouldRunResults[index]
  )

  for (const migration of migrationsToRun) {
    log('Running migration', migration.id)
    await migration.migrate()
    log('Finished migration', migration.id)
    await browser.storage.sync.set({
      migrations: uniq([...pastMigrations, migration.id])
    })

    if (migration.after) {
      await migration.after()
    }

    log('Migration list', uniq([...pastMigrations, migration.id]))
  }

  migrationsRan = true
}
