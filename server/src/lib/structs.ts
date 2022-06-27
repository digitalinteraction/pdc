import { ConferenceConfigStruct as DeconfConferenceConfigStruct } from '@openlab/deconf-api-toolkit'
import {
  array,
  assign,
  boolean,
  defaulted,
  Infer,
  object,
  string,
} from 'superstruct'

const PageFlag = object({
  enabled: boolean(),
  visible: boolean(),
  readonly: defaulted(boolean(), false),
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
      content: string(),
      papers: string(),
      places: string(),
      registrations: string(),
      sessions: string(),
      speakers: string(),
      themes: string(),
      tracks: string(),
      types: string(),
    }),
  }),
  settings: object({
    atrium: PageFlag,
    schedule: PageFlag,
    keynotes: PageFlag,
    places: PageFlag,
    papers: PageFlag,
    newcastle: PageFlag,
    social: PageFlag,
    help: PageFlag,
    about: PageFlag,

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
