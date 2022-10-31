import fs from 'fs/promises'
import { createTerminus } from '@godaddy/terminus'

import {
  AttendanceRepository,
  closeRedisClients,
  ConferenceRepository,
  createMemoryStore,
  EmailService,
  I18nService,
  JwtService,
  loadI18nLocales,
  loadResources,
  MetricsRepository,
  PostgresService,
  RedisService,
  RegistrationRepository,
  ResourcesMap,
  SemaphoreService,
} from '@openlab/deconf-api-toolkit'

import {
  AppContext,
  createDebug,
  createEnv,
  loadConfig,
  SocketService,
  UrlService,
  watchConfig,
} from '../lib/module.js'
import { createServer } from '../server.js'
import { migrateCommand } from './migrate-command.js'
import { RedisAdapter } from '@socket.io/redis-adapter'

const debug = createDebug('cmd:serve')

export interface ServeCommandOptions {
  port: number
  migrate: boolean
  settings: boolean
}

export async function createServerContext(): Promise<AppContext> {
  const env = createEnv()
  const config = await loadConfig()

  const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'))
  const resources = await loadResources('res')

  debug('package name=%o version=%o', pkg.name, pkg.version)
  debug('loaded resources %o', [...resources.keys()])

  const store = env.REDIS_URL
    ? new RedisService(env.REDIS_URL)
    : createMemoryStore()
  const postgres = new PostgresService({ env })
  const url = new UrlService({ env })
  const jwt = new JwtService({ env, store, config })
  const i18n = new I18nService(loadI18nLocales(resources, ['en']))
  const semaphore = new SemaphoreService({ store })
  const email = new EmailService({ env, config })
  const sockets = new SocketService()

  const attendanceRepo = new AttendanceRepository({ postgres })
  const conferenceRepo = new ConferenceRepository({ store })
  const registrationRepo = new RegistrationRepository({ postgres })
  const metricsRepo = new MetricsRepository({ postgres })

  // prettier-ignore
  return {
    config, env, pkg, resources, email, i18n, jwt, postgres, semaphore, sockets,
    store, url, attendanceRepo, conferenceRepo, metricsRepo, registrationRepo
  }
}

export async function serveCommand(options: ServeCommandOptions) {
  debug('start')

  const context = await createServerContext()
  const { env, store, config, postgres } = context

  const configWatcher =
    env.NODE_ENV === 'development' && options.settings
      ? watchConfig(config, store)
      : null

  if (options.migrate) {
    await migrateCommand({})
  }

  if (options.settings) {
    await store.put('schedule.settings', config.settings)
  }

  debug('creating server')
  const { server, io } = createServer(context)

  server.listen(options.port, () => {
    debug('Listening on http://0.0.0.0:%d', options.port)
  })

  createTerminus(server, {
    signals: ['SIGINT', 'SIGTERM'],
    healthChecks: {
      '/healthz': async () => {
        try {
          debug('/healthz check redis')
          await store.checkHealth()
          debug('/healthz check postgres')
          await postgres.checkHealth()
          debug('/healthz check done')
        } catch (error) {
          debug('check failed', error)
          throw error
        }
      },
    },
    beforeShutdown: () => {
      // Wait 5s more to shutdown when in production
      // to give loadbalancers time to update
      const wait = env.NODE_ENV !== 'development' ? 5000 : 0
      debug('beforeShutdown wait=%dms', wait)
      return new Promise((resolve) => setTimeout(resolve, wait))
    },
    onSignal: async () => {
      debug('onSignal')
      await store.close()
      await postgres.close()
      configWatcher?.abort()

      const adapter = io?.of('/').adapter
      if (adapter && adapter instanceof RedisAdapter) {
        await closeRedisClients(adapter.pubClient, adapter.subClient)
      }
    },
  })
}
