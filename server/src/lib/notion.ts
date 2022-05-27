import path from 'path'
import crypto from 'crypto'

import NotionHq from '@notionhq/client'
import { GetBlockResponse } from '@notionhq/client/build/src/api-endpoints'

import { createDebug } from './utils.js'
import { UrlService } from './url-service.js'
import { LocalisedLink } from '@openlab/deconf-shared/dist/conference'

const debug = createDebug('lib:notion')

export interface NotionProp {
  id: string
  type: string
  [id: string]: any
}

export interface NotionPage {
  id: string
  props: Record<string, NotionProp>
  blocks: NotionBlock[]
}

export type NotionBlock = Record<string, any> & {
  object: 'block'
  id: string
  type: string
  created_time: string
  last_edited_time: string
  created_by: any
  last_edited_by: any
  has_children: boolean
  archived: boolean
}

function sha256Hash(input: string) {
  return crypto.createHash('sha256').update(input).digest('base64url')
}

/** Utilities for formatting notion data into useful values */
export const notionFmt = {
  title(value: any) {
    return value?.title?.[0]?.plain_text
  },
  select(value: any) {
    return value?.select?.name
  },
  multiSelect(value: any) {
    const result = value?.multi_select?.map((i: any) => i.name)
    if (result?.length === 0) return undefined
    return result
  },
  checkbox(value: any) {
    return value?.checkbox === true
  },
  relationIds(value: any) {
    return value?.relation?.map((i: any) => i.id)
  },
  slot(s: any, e: any) {
    const start = new Date(s)
    const end = new Date(e)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return undefined
    }
    const id = start.getTime() + '__' + end.getTime()
    return { id, start, end }
  },
  richText(value: any) {
    const segments = value?.rich_text?.map((rt: any) => {
      let text = rt.text?.content ?? ''
      const wraps = []
      if (rt.annotations?.bold) wraps.push('**')
      if (rt.annotations?.italic) wraps.push('_')
      if (rt.annotations?.strikethrough) wraps.push('~')
      // todo: annotations?.underline ???
      if (rt.annotations?.code) wraps.push('`')
      if (rt.text?.link?.url) {
        text = `[${text}](${rt.text.link.url})`
      }

      // Don't annotate empty-text
      if (!text.trim()) return text

      return wraps.join('') + text + Array.from(wraps).reverse().join('')
    })
    return segments?.join('')
  },
}

/** A context that persists during the rendering of notion content */
export interface NotionRenderContext {
  /** Files that have been touched and may need re-downloading */
  files: Map<string, { filename: string; newUrl: string; originalUrl: string }>
}

type Context = {
  url: UrlService
  options: {
    notionToken: string
  }
}

export class NotionService {
  client: NotionHq.Client
  #context: Context
  constructor(context: Context) {
    this.#context = context
    this.client = new NotionHq.Client({
      auth: context.options.notionToken,
    })
  }

  /** For a given notion block, attempt to convert it into markdown */
  getMarkdown(block: NotionBlock, ctx: NotionRenderContext) {
    if (block.type === 'paragraph') {
      return notionFmt.richText(block.paragraph) + '\n'
    }
    if (block.type === 'heading_1') {
      return `# ${notionFmt.richText(block.heading_1)}\n`
    }
    if (block.type === 'heading_2') {
      return `## ${notionFmt.richText(block.heading_2)}\n`
    }
    if (block.type === 'heading_3') {
      return `### ${notionFmt.richText(block.heading_3)}\n`
    }
    if (block.type === 'callout') {
      return `> ${block.callout.icon} ${notionFmt.richText(block.callout)}\n`
    }
    if (block.type === 'quote') {
      return `> ${notionFmt.richText(block.quote)}\n`
    }
    if (block.type === 'bulleted_list_item') {
      return `* ${notionFmt.richText(block.bulleted_list_item)}`
    }
    if (block.type === 'numbered_list_item') {
      return `0. ${notionFmt.richText(block.numbered_list_item)}`
    }
    if (block.type === 'to_do') {
      const pre = block.to_do.checked ? 'x' : ' '
      return `- [${pre}] ${notionFmt.richText(block.to_do)}`
    }
    if (block.type === 'code') {
      const text = notionFmt.richText(block.code)
      return '```' + `${block.code.language}\n${text}` + '```\n'
    }
    if (block.type === 'image') {
      let url: string
      let alt: string
      if (block.image.type === 'file') {
        url = this.getFile(block.image.file.url, ctx)
        alt = notionFmt.richText({
          rich_text: block.image.caption,
        })
      } else if (block.image.type === 'external') {
        url = block.image.external.url
        alt = notionFmt.richText({
          rich_text: block.image.caption,
        })
      } else {
        console.error('Unknown image type %o', block.image.type)
        return '' // unknown image type
      }
      return `![${alt}](${url} "${alt.replace(/"/g, '')}")`
    }

    console.error('Unknown block type %o', block.type)
    return '' // unknown block
  }

  /** Parse a URL and if it is valid strip out URL parameters */
  stripUrlParameters(input: string) {
    try {
      const url = new URL(input)
      return url.origin + url.pathname
    } catch (error) {
      console.error('ERROR: bad image URL %o', input)
      return input
    }
  }

  /** Get a file in the current render context and/or prep one for download */
  getFile(inputUrl: string, ctx: NotionRenderContext) {
    // Generate a filename by hashing the url (without search params)
    // and appending the file extension
    // uses "base64url" to ensure it is a valid filename
    const url = this.stripUrlParameters(inputUrl)
    const filename = sha256Hash(url) + path.extname(url)

    // Return an existing file if it was preloaded or already processed
    const existing = ctx.files.get(filename)
    if (existing) return existing.newUrl

    // Generate a url to access the new file, cache it and return the url
    const newUrl = this.#context.url.getNotionFile(filename).toString()
    ctx.files.set(filename, { filename, newUrl, originalUrl: inputUrl })
    return newUrl
  }

  /** Convert a sequence of notion blocks into a markdown file */
  getPageMarkdown(blocks: NotionBlock[], ctx: NotionRenderContext) {
    return blocks
      .map((b) => this.getMarkdown(b, ctx))
      .filter((t) => t)
      .join('\n')
  }

  /** paginate through `notion.databases.query` and fetch page blocks */
  async queryNotionDatabase(db: string) {
    debug('retrieveAll db=%o', db)

    let res = await this.client.databases.query({
      database_id: db,
    })
    let all = res.results

    while (res.next_cursor !== null) {
      debug('retrieveAll db=%o next=%o', db, res.next_cursor)

      res = await this.client.databases.query({
        database_id: db,
        start_cursor: res.next_cursor,
      })

      all = all.concat(res.results)
    }

    const merged: Array<NotionPage> = []

    for (const page of all) {
      merged.push({
        id: page.id,
        props: (page as any).properties,
        blocks: (await this.queryPageBlocks(page.id)) as any,
      })
    }

    return merged
  }

  /** paginate through `notion.blocks.children.list` for a page */
  async queryPageBlocks(page: string) {
    debug('retrieveAll page=%o', page)

    let res = await this.client.blocks.children.list({ block_id: page })
    let all = res.results as GetBlockResponse[]

    while (res.next_cursor !== null) {
      debug('retrieveAll page=%o next=%o', page, res.next_cursor)

      res = await this.client.blocks.children.list({
        block_id: page,
        start_cursor: res.next_cursor,
      })

      all = all.concat(res.results)
    }

    return all
  }
}
