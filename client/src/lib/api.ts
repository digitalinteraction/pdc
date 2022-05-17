import { ConferenceConfig, PageFlag } from '@openlab/deconf-shared'

// export type PdcConferenceConfig = ConferenceConfig
export interface PdcConferenceConfig {
  home?: PageFlag
  programme?: PageFlag
  keynotes?: PageFlag
  papers?: PageFlag
  places?: PageFlag
  newcastle?: PageFlag
  social?: PageFlag
  help?: PageFlag

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

// TODO: migrate to deconf use

export function getSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[^\w-]+/g, '')
}
