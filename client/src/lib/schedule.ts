import { Session } from '@openlab/deconf-shared'
import { Routes } from '@openlab/deconf-ui-toolkit'
import { Location } from 'vue-router'

/** Work out which page to return to from a given `Session` */
export function getSessionParentRoute(session: Session): Location {
  // TODO: implement this

  return { name: Routes.Schedule }
}
