import {
  DeconfEnv,
  UrlService as DeconfUrlService,
} from '@openlab/deconf-api-toolkit'

type Context = {
  env: Pick<DeconfEnv, 'CLIENT_URL' | 'SELF_URL'> & {
    STATIC_URL: string | null
  }
}

export class UrlService implements Readonly<DeconfUrlService> {
  #context: Context
  constructor(context: Context) {
    this.#context = context
  }

  getSessionLink(sessionId: string): URL {
    return new URL(`session/${sessionId}`, this.#context.env.CLIENT_URL)
  }

  getClientLoginLink(token: string): URL {
    const url = new URL('_auth', this.#context.env.CLIENT_URL)

    const params = new URLSearchParams()
    params.set('token', token)
    url.hash = params.toString()

    return url
  }

  getClientErrorLink(errorCode?: string): URL {
    return errorCode
      ? new URL(`error/${errorCode}`, this.#context.env.CLIENT_URL)
      : new URL(`error`, this.#context.env.CLIENT_URL)
  }

  getServerLoginLink(token: string): URL {
    return new URL(`auth/login/${token}`, this.#context.env.SELF_URL)
  }

  getClientAsset(asset: string): URL {
    return new URL(asset, this.#context.env.CLIENT_URL)
  }

  getNotionFile(filename: string): URL {
    if (this.#context.env.STATIC_URL) {
      return new URL(`notion/${filename}`, this.#context.env.STATIC_URL)
    }
    return new URL(`static/notion/${filename}`, this.#context.env.SELF_URL)
  }
}
