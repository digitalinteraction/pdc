import { AuthSockets } from '@openlab/deconf-api-toolkit'
import { Socket } from 'socket.io'
import {
  AppBroker,
  AppContext,
  createDebug,
  SocketErrorHandler,
} from '../lib/module.js'

const debug = createDebug('io:metrics')

export class AuthBroker implements AppBroker {
  #sockets: AuthSockets
  constructor(context: AppContext) {
    this.#sockets = new AuthSockets(context)
  }

  async socketConnected(socket: Socket, handleErrors: SocketErrorHandler) {
    socket.on(
      'auth',
      handleErrors(async (authToken) => {
        debug('@auth socket=%o', socket.id)
        await this.#sockets.auth(socket.id, authToken)
      })
    )

    socket.on(
      'deauth',
      handleErrors(async () => {
        debug('@deauth socket=%o', socket.id)
        await this.#sockets.deauth(socket.id)
      })
    )
  }

  async socketDisconnected(socket: Socket) {
    await this.#sockets.deauth(socket.id).catch(() => {})
  }
}
