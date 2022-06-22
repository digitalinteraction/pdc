import {
  DECONF_MIGRATIONS,
  MigrateRepository,
  MigrateService,
  PostgresService,
  RedisService,
  SemaphoreService,
} from '@openlab/deconf-api-toolkit'
import { createDebug, createEnv } from '../lib/module.js'

const debug = createDebug('cmd:migrate')

const MIGRATE_SEMAPHORE = 'migrate_lock'
const PDC_MIGRATIONS = [...DECONF_MIGRATIONS]

export interface MigrateCommandOptions {
  // ...
}

export async function migrateCommand(options: MigrateCommandOptions) {
  debug('start')

  const env = createEnv()
  if (!env.REDIS_URL) throw new Error('REDIS_URL not set')

  const store = new RedisService(env.REDIS_URL)
  const semaphore = new SemaphoreService({ store })

  debug(
    'migrations %o',
    PDC_MIGRATIONS.map((m) => m.id)
  )

  try {
    const hasLock = await semaphore.aquire(MIGRATE_SEMAPHORE, 5000)
    if (!hasLock) throw new Error('Failed to aquire lock')
    debug('aquired lock %o', MIGRATE_SEMAPHORE)

    const postgres = new PostgresService({ env })

    debug('connecting to postgres')
    await postgres.run(async (client) => {
      const migrateRepo = new MigrateRepository(client)
      const migrate = new MigrateService({ migrateRepo })

      debug('running migrations')
      await migrate.runMigrations(PDC_MIGRATIONS)
    })

    debug('disconnecting')
    await postgres.close()

    debug('waiting 5s')
    await new Promise((resolve) => setTimeout(resolve, 5000))
  } finally {
    await semaphore.release(MIGRATE_SEMAPHORE)
    await store.close()
  }
}
