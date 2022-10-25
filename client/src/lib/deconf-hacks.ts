// TODO: migrate these back to @openlab/deconf-ui (requires breaking change)

import { AuthToken, PageFlag, ScheduleRecord } from '@openlab/deconf-shared'
import {
  ApiModuleState,
  createStateMapper,
  Routes,
} from '@openlab/deconf-ui-toolkit'
import VueRouter from 'vue-router'
import { PdcConferenceConfig } from './api'

// Specify a PageFlag directly, working with the update mapApiState below for strong types
export function guardRoute(
  flag: PageFlag | undefined,
  user: AuthToken | null,
  router: VueRouter
) {
  if (user && user.user_roles.includes('admin')) return
  if (!flag) return

  if (!flag || flag.enabled !== true || flag.visible !== true) {
    router.replace({ name: Routes.NotFound })
  }
}

// TODO: work out a generic way to migrate this back (requires breaking change)
type PdcApiModuleState = Omit<ApiModuleState, 'schedule'> & {
  schedule: Omit<ScheduleRecord, 'settings'> & {
    settings: PdcConferenceConfig
  }
}
export const mapApiState = createStateMapper<PdcApiModuleState>()
