import Vue from 'vue'
import Vuex from 'vuex'

import { apiModule } from './api-module'
import { metricsModule } from './metrics-module'

import { ApiModuleState, MetricsModuleState } from '@openlab/deconf-ui-toolkit'
import { placesModule, PlacesModuleState } from './places-module'
import { papersModule, PapersModuleState } from './papers-module'

export interface StoreState {
  api: ApiModuleState
  metrics: MetricsModuleState
  places: PlacesModuleState
  papers: PapersModuleState
}

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    api: apiModule(),
    metrics: metricsModule(),
    places: placesModule(),
    papers: papersModule(),
  },
})
