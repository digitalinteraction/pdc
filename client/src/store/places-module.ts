import { env } from '@/plugins/env-plugin'
import { Module } from 'vuex'
import { pickApi } from './api-client'

export interface PlaceRecord {
  id: string
  title: string
  sessions: string[]
  content: string
}

export interface PlacesModuleState {
  places: null | PlaceRecord[]
}

export type PlacesStoreModule = Module<PlacesModuleState, unknown>

export function placesModule(): PlacesStoreModule {
  const apiClient = pickApi(env)

  return {
    namespaced: true,
    state: {
      places: [],
    },
    mutations: {
      places(state, places: PlaceRecord[]) {
        state.places = places
      },
    },
    actions: {
      async fetch(ctx) {
        const places = await apiClient.getPlaces()
        ctx.commit('places', places)
      },
    },
  }
}
