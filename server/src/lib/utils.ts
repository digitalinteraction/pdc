import crypto from 'crypto'
import fs from 'fs/promises'
import {
  ApiError,
  KeyValueService,
  loadConfig as loadDeconfConfig,
} from '@openlab/deconf-api-toolkit'

import debug from 'debug'
import { AppConfig, AppConfigStruct } from './structs.js'
import { create } from 'superstruct'

//
// Misc
//

export function createDebug(namespace: string) {
  return debug(`pdc:${namespace}`)
}

export function getRedirectErrorCode(error: unknown) {
  let errorCode: string | undefined = undefined

  if (error instanceof ApiError) {
    for (const code of error.codes) {
      if (code === 'general.notFound') return 'not_found'
      if (code === 'auth.tokenExpired') return 'login_expired'
    }
  }

  return errorCode
}

export async function loadConfig() {
  const rawConfig = JSON.parse(await fs.readFile('app-config.json', 'utf8'))
  return create(rawConfig, AppConfigStruct)
}

export function watchConfig(config: AppConfig, store: KeyValueService) {
  const debug = createDebug('utils:config')
  debug('watching app-config.json')

  const abort = new AbortController()
  const { signal } = abort
  const watcher = fs.watch('app-config.json', { signal })

  ;(async () => {
    try {
      for await (const event of watcher) {
        if (event.eventType !== 'change') continue
        for (const key in config) delete (config as any)[key]
        Object.assign(config, await loadConfig())
        debug('app-config.json updated')
        store?.put('schedule.settings', config.settings)
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      console.error('Fatal config-watcher error', error)
      process.exit(1)
    }
  })()

  return { config, abort: () => abort.abort() }
}

export function trimEmail(input: string) {
  return input.trim().toLowerCase()
}

export function sha256UrlHash(input: string) {
  return crypto.createHash('sha256').update(input).digest('base64url')
}
