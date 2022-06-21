import { createEnv as createDeconfEnv } from '@openlab/deconf-api-toolkit'

export type EnvRecord = ReturnType<typeof createEnv>

export function createEnv(processEnv = process.env) {
  const {
    REDIS_URL = null,
    STATIC_URL = null,
    ADMIN_EMAILS = null,
  } = processEnv
  const DISABLE_SOCKETS = Boolean(processEnv)

  return Object.assign(createDeconfEnv(processEnv), {
    REDIS_URL,
    DISABLE_SOCKETS,
    STATIC_URL,
    ADMIN_EMAILS: new Set(ADMIN_EMAILS?.split(/\s*,\s*/)),
  })
}
