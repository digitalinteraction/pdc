import { PageFlag } from '@openlab/deconf-shared'

// export type PdcConferenceConfig = ConferenceConfig
export interface PdcConferenceConfig {
  atrium?: PageFlag
  schedule?: PageFlag
  keynotes?: PageFlag
  places?: PageFlag
  newcastle?: PageFlag
  social?: PageFlag
  help?: PageFlag
  about?: PageFlag

  navigation: {
    showProfile: boolean
    showLogin: boolean
    showRegister: boolean
  }

  widgets: {
    siteVisitors: boolean
    twitter: boolean
    login: boolean
    register: boolean
  }
}
