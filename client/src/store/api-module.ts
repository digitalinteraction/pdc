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
// import { DeconfApiClient } from '@openlab/deconf-ui-toolkit'
import { StorageKey } from '@/lib/module'

// TODO: move non-ApiClient auth logic somewhere else

export function apiModule(): ApiStoreModule {
  // const apiClient = new DeconfApiClient(env.SERVER_URL.href, {})

  return {
    ...createApiStoreModule(),
    // getters: {
    //   apiClient: () => apiClient,
    // },
    actions: {
      // ...createApiStoreActions(apiClient),
      async authenticate({ commit, dispatch }, { token }: AuthenticateOptions) {
        const user = decodeJwt(token) as FullAuthToken

        if (user.iss !== env.JWT_ISSUER) {
          console.error('JWT signed by unknown issuer %o', user.iss)
          commit('user', null)
          return
        }

        commit('user', user)

        localStorage.setItem(StorageKey.AuthToken, token)
        // TODO: apiClient.setAuthToken(token)
        SocketIoPlugin.authenticate(token)

        await dispatch('fetchData')
        await dispatch('fetchUserAttendance')
      },
      async unauthenticate({ commit, dispatch }) {
        commit('user', null)

        localStorage.removeItem(StorageKey.AuthToken)
        //
        // TODO: apiClient.setAuthToken(null)
        // TODO: SocketIoPlugin.authenticate(null)
        //

        await dispatch('fetchData')
        await dispatch('fetchUserAttendance')
      },
    },
  }
}
