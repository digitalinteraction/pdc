import { env } from '@/plugins/env-plugin'
import { DeconfApiClient } from '@openlab/deconf-ui-toolkit'
import { Module } from 'vuex'

export interface PlaceRecord {
  id: string
  title: string
  sessions: string[]
  content: string
}

export interface PlacesModuleState {
  state: 'init' | 'working' | 'ready'
  places: null | PlaceRecord[]
}

export type PlacesStoreModule = Module<PlacesModuleState, unknown>

export function placesModule(): PlacesStoreModule {
  const api = new DeconfApiClient(env.SERVER_URL.href)

  return {
    namespaced: true,
    state: {
      state: 'init',
      places: [],
    },
    mutations: {
      places(state, places: PlaceRecord[]) {
        state.places = places
      },
    },
    actions: {
      async fetch(ctx) {
        const places = await api.fetchJson('places')
        ctx.commit('places', places)
      },
    },
  }
}
