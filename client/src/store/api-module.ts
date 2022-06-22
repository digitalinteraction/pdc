import {
  ApiStoreModule,
  AuthenticateOptions,
  createApiStoreActions,
  createApiStoreModule,
  decodeJwt,
  DeconfApiClient,
  FullAuthToken,
} from '@openlab/deconf-ui-toolkit'

import { UserRegistration, PrivateCalendar } from '@openlab/deconf-shared'

import { env } from '@/plugins/env-plugin'
import { SocketIoPlugin } from '@/plugins/socketio-plugin'
import { StorageKey } from '@/lib/module'

// TODO: move non-ApiClient auth logic somewhere else
// or move all api-key related logic here (e.g. setLocale)

// TODO: move these fixes back to deconf
class PdcApiClient extends DeconfApiClient {
  // FIXME: make the endpoint return the flat object or update the types
  getRegistration(): Promise<UserRegistration | null> {
    return this.fetchJson<{ registration: UserRegistration }>(
      this.getEndpoint('RegistrationRoutes.getRegistration')
    ).then((d) => d?.registration ?? null)
  }
  // FIXME: make PrivateCalendarCreate handle the URL properly
  createUserCalendar(): Promise<PrivateCalendar | null> {
    return this.fetchJson<any>(
      this.getEndpoint('CalendarRoutes.createUserCalendar')
    ).then((r) => r.url)
  }
}

export function apiModule(): ApiStoreModule {
  const apiClient = new PdcApiClient(env.SERVER_URL.href, {
    endpointMap: {
      // TODO: migrate fixes to deconf
      'AttendanceRoutes.getSessionAttendance': (sessionId) =>
        `attendance/${sessionId}`,
      'AttendanceRoutes.attend': (sessionId) =>
        `attendance/${sessionId}/attend`,
      'AttendanceRoutes.unattend': (sessionId) =>
        `attendance/${sessionId}/unattend`,
    },
  })

  return {
    ...createApiStoreModule(),
    getters: {
      apiClient: () => apiClient,
    },
    actions: {
      ...createApiStoreActions(apiClient),

      // TODO: migrate back to deconf
      async fetchContent(_, { slug }) {
        return apiClient.getContent(slug).then((r) => r?.content ?? null)
      },

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
