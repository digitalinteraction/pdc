import {
  DeconfConfigStruct,
  ConferenceConfigStruct as DeconfConferenceConfigStruct,
} from '@openlab/deconf-api-toolkit'
import { array, assign, boolean, Infer, object, string } from 'superstruct'

const pageFlag = () =>
  object({
    enabled: boolean(),
    visible: boolean(),
  })

export type AppConfig = Infer<typeof AppConfigStruct>
export const AppConfigStruct = object({
  mail: object({
    fromEmail: string(),
    replyToEmail: string(),
  }),
  sendgrid: object({
    loginTemplateId: string(),
  }),
  jwt: object({
    issuer: string(),
  }),
  content: object({
    keys: array(string()),
  }),
  notion: object({
    db: object({
      sessions: string(),
      themes: string(),
      tracks: string(),
      speakers: string(),
      types: string(),
      content: string(),
    }),
  }),
  settings: object({
    atrium: pageFlag(),
    schedule: pageFlag(),
    keynotes: pageFlag(),
    papers: pageFlag(),
    places: pageFlag(),
    newcastle: pageFlag(),
    social: pageFlag(),
    help: pageFlag(),

    navigation: object({
      showProfile: boolean(),
      showLogin: boolean(),
      showRegister: boolean(),
    }),

    widgets: object({
      siteVisitors: boolean(),
      twitter: boolean(),
      login: boolean(),
      register: boolean(),
    }),
  }),
})

/** Koa Session URL parameters e.g. /session/:sessionId */
export const SessionIdStruct = object({
  sessionId: string(),
})

/** Koa token URL parameters e.g. /auth/:token */
export const TokenStruct = object({
  token: string(),
})

export const ConferenceConfigStruct = assign(
  DeconfConferenceConfigStruct,
  object({
    // extra pages ...
    // navigation flags ...
    // atrium widgets ...
  })
)

export type BlockList = Infer<typeof BlockedStruct>
export const BlockedStruct = object({
  emails: array(string()),
})
