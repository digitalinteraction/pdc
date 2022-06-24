import Vue from 'vue'
import Vuex from 'vuex'

import { apiModule } from './api-module'
import { metricsModule } from './metrics-module'

import { ApiModuleState, MetricsModuleState } from '@openlab/deconf-ui-toolkit'
import { placesModule, PlacesModuleState } from './places-module'

export interface StoreState {
  api: ApiModuleState
  metrics: MetricsModuleState
  places: PlacesModuleState
}

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    api: apiModule(),
    metrics: metricsModule(),
    places: placesModule(),
  },
})
