import { PageFlag } from '@openlab/deconf-shared'

export type PdcPageFlag = PageFlag & {
  readonly: boolean
}

// export type PdcConferenceConfig = ConferenceConfig
export interface PdcConferenceConfig {
  atrium?: PdcPageFlag
  schedule?: PdcPageFlag
  keynotes?: PdcPageFlag
  places?: PdcPageFlag
  newcastle?: PdcPageFlag
  social?: PdcPageFlag
  help?: PdcPageFlag
  about?: PdcPageFlag

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
