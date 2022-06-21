import crypto from 'crypto'
import {
  ApiError,
  loadConfig as loadDeconfConfig,
} from '@openlab/deconf-api-toolkit'

import debug from 'debug'
import { AppConfigStruct } from './structs.js'

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

export function loadConfig() {
  return loadDeconfConfig('app-config.json', AppConfigStruct)
}

export function trimEmail(input: string) {
  return input.trim().toLowerCase()
}

export function sha256UrlHash(input: string) {
  return crypto.createHash('sha256').update(input).digest('base64url')
}
