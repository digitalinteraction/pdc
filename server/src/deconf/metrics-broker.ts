import {
  eventStructs as deconfEventStructs,
  MetricsSockets,
} from '@openlab/deconf-api-toolkit'
import { Socket } from 'socket.io'
import {
  AppBroker,
  AppContext,
  createDebug,
  SocketErrorHandler,
} from '../lib/module.js'

const debug = createDebug('io:metrics')
const eventStructs = new Map(deconfEventStructs)

export class MetricsBroker implements AppBroker {
  #sockets: MetricsSockets
  constructor(context: AppContext) {
    this.#sockets = new MetricsSockets({
      ...context,
      eventStructs,
      pause: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    })
  }

  async socketConnected(socket: Socket, handleErrors: SocketErrorHandler) {
    this.#sockets.cameOnline(socket.id).catch((error) => {
      console.error('MetricsBroker#cameOnline', error)
    })

    socket.on(
      'trackMetric',
      handleErrors(async (eventName, payload) => {
        debug('trackMetric socket=%o event=%o', socket.id, eventName)
        await this.#sockets.event(socket.id, eventName, payload)
      })
    )

    socket.on(
      'trackError',
      handleErrors(async (error) => {
        debug('trackError socket=%o', socket.id)
        await this.#sockets.error(socket.id, error)
      })
    )
  }

  async socketDisconnected(socket: Socket) {
    await this.#sockets.wentOffline(socket.id)
  }
}
