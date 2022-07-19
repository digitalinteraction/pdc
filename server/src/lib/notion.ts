import path from 'path'

import NotionHq from '@notionhq/client'
import { GetBlockResponse } from '@notionhq/client/build/src/api-endpoints'

import { createDebug, sha256UrlHash } from './utils.js'
import { UrlService } from './url-service.js'
import { LocalisedLink } from '@openlab/deconf-shared/dist/conference'

const debug = createDebug('lib:notion')

export interface NotionProp {
  id: string
  type: string
  [type: string]: any
}

export interface NotionPage {
  id: string
  props: Record<string, NotionProp>
  blocks: NotionBlock[]
  cover: {
    type: string
    [type: string]: any
  }
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

/** Utilities for formatting notion data into useful values */
export const notionFmt = {
  title(value: any) {
    // Our titles ignore markdown
    return value?.title?.map((t: any) => t.plain_text)?.join(' ')
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
  email(value: any) {
    return value?.email
  },
  text(value: any, { markdown = false } = {}) {
    if (value.type === 'text') {
      const text = value.text.content
      if (!markdown) return text

      const wraps = []
      if (value.annotations?.bold) wraps.push('**')
      if (value.annotations?.italic) wraps.push('_')
      if (value.annotations?.strikethrough) wraps.push('~~')
      if (value.annotations?.code) wraps.push('`')

      const unwraps = Array.from(wraps).reverse()
      const annotated = [...wraps, text.trim(), ...unwraps].join('')

      if (value.text.link?.url) {
        // if (/view paper/i.test(text)) {
        //   const url = '/papers' + value.text.link.url
        //   return `<a class="button is-link" href="${url}">${text} →</a>`
        // }
        return `[${annotated}](${value.text.link.url})`
      }

      return ' ' + annotated + ' '
    }

    // TODO: review this
    if (value.type === 'mention' && value.mention.type === 'page') {
      const url = '/papers/' + value.mention.page.id
      return `<a class="button is-link" href="${url}">View paper →</a>`
    }

    console.error('Unknown rich_text type %o', value.type)
    return ''
  },
  richText(value: any) {
    return value?.rich_text
      ?.map((rt: any) => notionFmt.text(rt, { markdown: true }))
      .join('')
  },
}

function parseEmbedUrl(url: URL): Record<string, string> | null {
  // youtube.com?v=123456
  // youtube.com?list=654321
  if (url.host.endsWith('youtube.com')) {
    const video = url.searchParams.get('v')
    const list = url.searchParams.get('list')

    const attrs = {
      title: 'YouTube video player',
      allow: 'clipboard-write; encrypted-media; picture-in-picture',
      allowfullscreen: '',
    }

    if (list) {
      return {
        ...attrs,
        src: `https://www.youtube-nocookie.com/embed/videoseries?list=${list}`,
      }
    }

    if (video) {
      return {
        ...attrs,
        src: `https://www.youtube-nocookie.com/embed/${video}`,
      }
    }
  }

  // vimeo.com/123456
  if (url.host.endsWith('vimeo.com')) {
    const id = url.pathname.replace(/^\/+/, '').replace(/\/+$/, '')
    return {
      title: 'Vimeo video player',
      allow: 'autoplay',
      src: `https://player.vimeo.com/video/${id}`,
    }
  }

  return null
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
    if (block.type === 'divider') {
      return '<hr>'
    }
    if (block.type === 'callout') {
      const prefix = block.callout.icon.emoji ?? ''
      return `> ${prefix} ${notionFmt.richText(block.callout)}\n`
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
      return [
        `<figure>`,
        `<img src="${url}">`,
        alt ? `<figcaption>${alt}</figcaption>` : '',
        `</figure>`,
      ].join('')
    }
    if (block.type === 'pdf') {
      let title: string
      let url: string
      if (block.pdf.type === 'file') {
        url = this.getFile(block.pdf.file.url, ctx)
        title = block.pdf.caption.map((c: any) => notionFmt.text(c)).join('')
      } else {
        console.error('Unknown pdf type %o', block.pdf.type)
        return ''
      }
      const filename = title?.replace(/[\s]+/g, '-').toLowerCase() || 'paper'
      return `<a class="button is-primary" download="${filename}.pdf" href="${url}" target="_blank">Download PDF →</a>`
    }
    if (block.type === 'video') {
      let url: URL
      if (block.video.type === 'external') {
        url = new URL(block.video.external.url)
      } else {
        console.error('Unknown video type %o', block.image.type)
        return ''
      }

      const attrs = Object.entries(parseEmbedUrl(url) ?? {})
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ')

      if (!attrs) {
        console.error('Unknown embed %o', url.toString())
        return ''
      }

      return [
        '<div class="iframeEmbed">',
        `<iframe class="iframeEmbed-iframe" width="100%" height="100%" ${attrs}></iframe>`,
        '</div>',
      ].join('')
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
    const filename = sha256UrlHash(url) + path.extname(url)

    // Return an existing file if it was preloaded or already processed
    const existing = ctx.files.get(filename)
    if (existing) return existing.newUrl

    // Generate a url to access the new file, cache it and return the url
    const newUrl = this.#context.url.getNotionFile(filename).toString()
    ctx.files.set(filename, { filename, newUrl, originalUrl: inputUrl })
    return newUrl
  }

  /**
   * Get a file's URL, marking the file for download if needed.
   * This was in `fmt` but it needs a context and NotionService instance
   */
  getFileUrl(value: any, ctx: NotionRenderContext) {
    if (value?.type === 'external') return value.external.url
    if (value?.type === 'file') return this.getFile(value.file.url, ctx)
    return null
  }

  /** Convert a sequence of notion blocks into a markdown file */
  getPageMarkdown(blocks: NotionBlock[], ctx: NotionRenderContext) {
    return blocks
      .map((b) => this.getMarkdown(b, ctx))
      .filter((t) => t)
      .join('\n\n')
  }

  /** paginate through `notion.databases.query` and fetch page blocks */
  async queryNotionDatabase(db: string) {
    debug('queryNotionDatabase db=%o', db)

    let res = await this.client.databases.query({
      database_id: db,
    })
    let all = res.results

    while (res.next_cursor !== null) {
      debug('queryNotionDatabase db=%o next=%o', db, res.next_cursor)

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
        cover: (page as any).cover,
        props: (page as any).properties,
        blocks: (await this.queryPageBlocks(page.id)) as any,
      })
    }

    return merged
  }

  /** paginate through `notion.blocks.children.list` for a page */
  async queryPageBlocks(page: string) {
    debug('queryPageBlocks page=%o', page)

    let res = await this.client.blocks.children.list({ block_id: page })
    let all = res.results as GetBlockResponse[]

    while (res.next_cursor !== null) {
      debug('queryPageBlocks page=%o next=%o', page, res.next_cursor)

      res = await this.client.blocks.children.list({
        block_id: page,
        start_cursor: res.next_cursor,
      })

      all = all.concat(res.results)
    }

    return all
  }
}
