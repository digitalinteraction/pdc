import {
  DeconfConfigStruct,
  ConferenceConfigStruct as DeconfConferenceConfigStruct,
} from '@openlab/deconf-api-toolkit'
import { array, assign, Infer, object, string } from 'superstruct'

export type AppConfig = Infer<typeof AppConfigStruct>
export const AppConfigStruct = assign(
  DeconfConfigStruct,
  object({
    sendgrid: object({
      loginTemplateId: string(),
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
        copy: string(),
      }),
    }),
  })
)

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
