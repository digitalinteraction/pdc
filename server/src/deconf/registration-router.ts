import KoaRouter from '@koa/router'
import {
  ApiError,
  RegistrationMailer,
  RegistrationRoutes,
} from '@openlab/deconf-api-toolkit'
import { Registration } from '@openlab/deconf-shared/dist/registration'
import { object } from 'superstruct'

import { AppContext, AppRouter, BlockList } from '../lib/module.js'

type Context = AppContext

export class RegistrationRouter implements AppRouter, RegistrationMailer {
  #context: Context
  #routes: RegistrationRoutes<any>
  constructor(context: Context) {
    this.#context = context
    this.#routes = new RegistrationRoutes({
      ...context,
      mailer: this,
      userDataStruct: object({}),
    })
  }

  //
  // Utils
  //
  #trimEmail(input: string) {
    return input.trim().toLowerCase()
  }

  async #assertNotBlocked(emailAddress: string) {
    const blocked = await this.#context.store.retrieve<BlockList>(
      'schedule.blocked'
    )
    if (blocked?.emails.includes(this.#trimEmail(emailAddress))) {
      throw ApiError.unauthorized()
    }
  }

  //
  // AppRouter
  //
  apply(router: KoaRouter): void {
    router.get('registration.me', '/auth/me', async (ctx) => {
      const token = this.#context.jwt.getRequestAuth(ctx.request.header)
      const result = await this.#routes.getRegistration(token)

      await this.#assertNotBlocked(result.registration.email)

      ctx.body = result
    })

    // TODO - registration.startLogin
    // TODO - registration.finishLogin
    // TODO - registration.unregister
  }

  //
  // RegistrationMailer
  //
  sendLoginEmail(registration: Registration, token: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  sendVerifyEmail(registration: Registration, token: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  sendAlreadyRegisteredEmail(
    registration: Registration,
    token: string
  ): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
