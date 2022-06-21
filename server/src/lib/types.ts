import KoaRouter from '@koa/router'
import { DeconfBaseContext } from '@openlab/deconf-api-toolkit'
import { Socket } from 'socket.io'
import { Infer } from 'superstruct'
import { EnvRecord } from './env'
import { SocketService } from './socket-service'
import { AppConfigStruct } from './structs'
import { UrlService } from './url-service'

export interface AppBroker {
  socketConnected(
    socket: Socket,
    handleErrors: SocketErrorHandler
  ): Promise<void>
  socketDisconnected(socket: Socket): Promise<void>
}

export interface SocketErrorHandler {
  (listener: (...args: any[]) => Promise<void>): (...args: any) => void
}

export interface AppRouter {
  apply(router: KoaRouter): void
}

export type AppContext = Pick<
  DeconfBaseContext,
  | 'resources'
  | 'jwt'
  | 'email'
  | 'i18n'
  | 'postgres'
  | 'semaphore'
  | 'store'
  | 'attendanceRepo'
  | 'conferenceRepo'
  | 'metricsRepo'
  | 'registrationRepo'
> & {
  config: Infer<typeof AppConfigStruct>
  env: EnvRecord
  pkg: {
    name: string
    version: string
  }
  url: Readonly<UrlService>
  sockets: Readonly<SocketService>
}

export interface RegisteredUsers {
  name: string
  email: string
}
