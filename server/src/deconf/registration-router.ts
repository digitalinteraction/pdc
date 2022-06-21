import KoaRouter from '@koa/router'
import {
  ApiError,
  EmailLoginTokenStruct,
  RegistrationMailer,
  RegistrationRoutes,
  validateStruct,
  VOID_RESPONSE,
} from '@openlab/deconf-api-toolkit'
import {
  AuthToken,
  EmailLoginToken,
  Registration,
} from '@openlab/deconf-shared'
import { object, string } from 'superstruct'

import {
  AppContext,
  AppRouter,
  BlockList,
  getRedirectErrorCode,
  RegisteredUsers,
  sha256UrlHash,
  TokenStruct,
  trimEmail,
} from '../lib/module.js'

const LoginStartBodyStruct = object({
  email: string(),
})

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
      config: {
        admins: [],
      },
    })
  }

  //
  // Utils
  //

  async #assertNotBlocked(emailAddress: string) {
    const blocked = await this.#context.store.retrieve<BlockList>(
      'schedule.blocked'
    )
    if (blocked?.emails.includes(trimEmail(emailAddress))) {
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

    router.post('registration.startLogin', '/auth/login', async (ctx) => {
      const emailAddress = trimEmail(
        validateStruct(ctx.request.body, LoginStartBodyStruct).email
      )
      await this.#assertNotBlocked(emailAddress)

      const registered =
        (await this.#context.store.retrieve<RegisteredUsers[]>(
          'registration.users'
        )) ?? []

      const hashedEmail = sha256UrlHash(emailAddress)
      const matchedRecord = registered.find((r) => r.email === hashedEmail)

      if (!matchedRecord) throw ApiError.unauthorized()

      let registrations = await this.#context.registrationRepo.getRegistrations(
        emailAddress
      )

      if (registrations.length === 0) {
        await this.#context.registrationRepo.register({
          name: matchedRecord.name,
          email: emailAddress,
          language: 'en',
          country: '',
          affiliation: '',
          userData: {},
        })
        registrations = await this.#context.registrationRepo.getRegistrations(
          emailAddress
        )
      }

      if (registrations.length === 0) throw ApiError.internalServerError()

      const [registration] = registrations.sort((a, b) => b.id - a.id)

      if (!registration) throw ApiError.internalServerError()

      const loginToken = this.#context.jwt.signToken<EmailLoginToken>(
        {
          kind: 'email-login',
          sub: registration.id,
          user_roles: [],
        },
        { expiresIn: '30m' }
      )

      this.sendLoginEmail(registration, loginToken)

      ctx.body = VOID_RESPONSE
    })

    router.get(
      'registration.finishLogin',
      '/auth/login/:token',
      async (ctx) => {
        try {
          const { token } = validateStruct(ctx.params, TokenStruct)
          const loginToken = this.#context.jwt.verifyToken(
            token,
            EmailLoginTokenStruct
          )

          await this.#context.registrationRepo.verifyRegistration(
            loginToken.sub
          )

          const registration =
            await this.#context.registrationRepo.getVerifiedRegistration(
              loginToken.sub
            )
          if (!registration) throw ApiError.unauthorized()

          await this.#assertNotBlocked(registration.email)

          const roles: string[] = ['attendee']
          if (this.#context.env.ADMIN_EMAILS.has(registration.email)) {
            roles.push('admin')
          }

          const authToken = this.#context.jwt.signToken<AuthToken>({
            kind: 'auth',
            sub: registration.id,
            user_lang: registration.language,
            user_roles: roles,
          })

          ctx.redirect(
            this.#context.url.getClientLoginLink(authToken).toString()
          )
        } catch (error) {
          ctx.redirect(
            this.#context.url
              .getClientErrorLink(getRedirectErrorCode(error))
              .toString()
          )
        }
      }
    )

    router.delete('registration.unregister', '/auth/me', async (ctx) => {
      const token = this.#context.jwt.getRequestAuth(ctx.request.headers)
      ctx.body = await this.#routes.unregister(token)
    })
  }

  //
  // RegistrationMailer
  //
  async sendLoginEmail(
    registration: Registration,
    token: string
  ): Promise<void> {
    const { i18n, email, config, url } = this.#context

    const subject = i18n.translate(registration.language, 'email.login.subject')

    email
      .sendTransactional(
        registration.email,
        subject,
        config.sendgrid.loginTemplateId,
        {
          subject: subject,
          url: url.getServerLoginLink(token).toString(),
        }
      )
      .catch((error) => {
        console.error('Failed to send email')
        console.error(error)
      })
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
