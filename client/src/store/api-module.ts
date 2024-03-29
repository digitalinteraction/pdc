import {
  ApiStoreModule,
  AuthenticateOptions,
  createApiStoreActions,
  createApiStoreModule,
  decodeJwt,
  FullAuthToken,
} from '@openlab/deconf-ui-toolkit'

import { env } from '@/plugins/env-plugin'
import { SocketIoPlugin } from '@/plugins/socketio-plugin'
import { StorageKey } from '@/lib/module'
import { pickApi } from './api-client'

// TODO: move non-ApiClient auth logic somewhere else
// or move all api-key related logic here (e.g. setLocale)

export function apiModule(): ApiStoreModule {
  const apiClient = pickApi(env)

  return {
    ...createApiStoreModule(),
    getters: {
      apiClient: () => apiClient,
    },
    actions: {
      ...createApiStoreActions(apiClient),

      async authenticate({ commit, dispatch }, { token }: AuthenticateOptions) {
        const user = decodeJwt(token) as FullAuthToken

        if (user.iss !== env.JWT_ISSUER) {
          console.error('JWT signed by unknown issuer %o', user.iss)
          commit('user', null)
          return
        }

        commit('user', user)

        localStorage.setItem(StorageKey.AuthToken, token)
        apiClient.setAuthToken(token)
        SocketIoPlugin.authenticate(token)

        await dispatch('fetchData')
        await dispatch('fetchUserAttendance')
      },
      async unauthenticate({ commit, dispatch }) {
        commit('user', null)

        localStorage.removeItem(StorageKey.AuthToken)
        apiClient.setAuthToken(null)
        SocketIoPlugin.unauthenticate()

        await dispatch('fetchData')
        await dispatch('fetchUserAttendance')
      },
    },
  }
}
