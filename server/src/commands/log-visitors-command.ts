import {
  closeRedisClients,
  createRedisClient,
  MetricsRepository,
  PostgresService,
  RedisService,
  SemaphoreService,
  SITE_VISITORS_ROOM,
} from '@openlab/deconf-api-toolkit'
import { createAdapter as socketIoRedisAdapter } from '@socket.io/redis-adapter'
import ms from 'ms'
import { Server as SocketIoServer } from 'socket.io'
import { createDebug } from '../lib/module.js'

const debug = createDebug('cmd:log-visitors')

const MAX_LOCK = ms('1m')
const LOCK_KEY = 'log-visitors/lock'

export async function logVisitorsCommand(args: unknown) {
  debug('start')

  const { REDIS_URL, DATABASE_URL } = process.env
  if (!REDIS_URL) throw new Error('REDIS_URL not set')
  if (!DATABASE_URL) throw new Error('DATABASE_URL not set')

  // Setup a store and create a semaphore
  const store = new RedisService(REDIS_URL)
  const semaphore = new SemaphoreService({ store })

  // Prepare a socket.io server which talks to redis
  const io = new SocketIoServer()
  const pub = createRedisClient(REDIS_URL)
  const sub = createRedisClient(REDIS_URL)
  io.adapter(socketIoRedisAdapter(pub, sub))

  // Connect to Postgres and create a metrics repo to log the metric
  const postgres = new PostgresService({ env: { DATABASE_URL } })
  const metricsRepo = new MetricsRepository({ postgres })

  // Ensure this process is locked, so only 1 runs at once
  const hasLock = await semaphore.aquire(LOCK_KEY, MAX_LOCK)
  if (!hasLock) {
    throw new Error(`Failed to aquire lock "${LOCK_KEY}"`)
  }
  debug('aquired lock %o', LOCK_KEY)

  try {
    // Fetch the number of site visitors
    const result = await io.in(SITE_VISITORS_ROOM).fetchSockets()
    debug('visitors %o', result.length)

    // Log the metric
    await metricsRepo.trackEvent('internal/siteVisitors', {
      visitors: result.length,
    })

    debug('done')
  } catch (error) {
    console.error('site-visitors: An error occured')
    console.error(error)
    throw error
  } finally {
    // Unlock the semaphore
    const release = await semaphore.release(LOCK_KEY)
    debug('released lock %o', release)

    // Close live connections
    await store.close()
    await postgres.close()
    closeRedisClients(pub, sub)

    debug('closed')
  }
}
