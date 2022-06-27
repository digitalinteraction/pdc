import { PapersModuleState } from '@/store/papers-module'
import { PlacesModuleState } from '@/store/places-module'
import { createStateMapper } from '@openlab/deconf-ui-toolkit'

export const mapPlacesState = createStateMapper<PlacesModuleState>()
export const mapPapersState = createStateMapper<PapersModuleState>()
