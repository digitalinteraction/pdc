import fs from 'fs/promises'
import { mask, object, string } from 'superstruct'
import NotionHq from '@notionhq/client'

import {
  Session,
  SessionSlot,
  SessionState,
  SessionType,
  SessionVisibility,
  Speaker,
  Theme,
  Track,
} from '@openlab/deconf-shared'
import {
  ContentRepository,
  ContentService,
  RedisService,
} from '@openlab/deconf-api-toolkit'

import { loadConfig, createDebug } from '../lib/module.js'

const debug = createDebug('cmd:fetch-schedule')

interface NotionProp {
  id: string
  type: string
  [id: string]: any
}

interface NotionPage {
  id: string
  props: Record<string, NotionProp>
  blocks: any[]
}

/** Format notion properties */
const fmt = {
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
      if (rt.bold) wraps.push('**')
      if (rt.italic) wraps.push('_')
      if (rt.strikethrough) wraps.push('~')
      // todo: underline?
      if (rt.code) wraps.push('`')
      if (rt.text?.link?.url) {
        text = `[${text}](${rt.text.link.url})`
      }
      const unwraps = Array.from(wraps).reverse()

      return wraps.join('') + text + unwraps.join('')
    })
    return segments?.join('')
  },
}
/** Render notion blocks to markdown */
const blockRenderers = new Map<string, (block: any) => string>()
blockRenderers.set('paragraph', (block) => {
  return fmt.richText(block.paragraph) + '\n'
})
blockRenderers.set('heading_1', (block) => {
  return `# ${fmt.richText(block.heading_1)}\n`
})
blockRenderers.set('heading_2', (block) => {
  return `## ${fmt.richText(block.heading_2)}\n`
})
blockRenderers.set('heading_3', (block) => {
  return `### ${fmt.richText(block.heading_3)}\n`
})
blockRenderers.set('callout', (block) => {
  return `> ${block.callout.icon} ${fmt.richText(block.callout)}\n`
})
blockRenderers.set('quote', (block) => {
  return `> ${fmt.richText(block.quote)}\n`
})
blockRenderers.set('bulleted_list_item', (block) => {
  return `* ${fmt.richText(block.bulleted_list_item)}`
})
blockRenderers.set('numbered_list_item', (block) => {
  return `0. ${fmt.richText(block.numbered_list_item)}`
})
blockRenderers.set('to_do', (block) => {
  const pre = block.to_do.checked ? 'x' : ' '
  return `- [${pre}] ${fmt.richText(block.to_do)}`
})
blockRenderers.set('code', (block) => {
  const text = fmt.richText(block.code)
  return '```' + `${block.code.language}\n${text}` + '```\n'
})

/** Convert a sequence of notion blocks into a markdown file */
function getMarkdown(blocks: any[]) {
  return blocks
    .map((b) => blockRenderers.get(b.type)?.(b))
    .filter((t) => t)
    .join('\n')
}

/** paginate through `notion.databases.query` and fetch page blocks */
async function queryAll(notion: NotionHq.Client, db: string) {
  debug('retrieveAll db=%o', db)

  let res = await notion.databases.query({
    database_id: db,
  })
  let all = res.results

  while (res.next_cursor !== null) {
    debug('retrieveAll db=%o next=%o', db, res.next_cursor)

    res = await notion.databases.query({
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
      blocks: await retrieveAll(notion, page.id),
    })
  }

  return merged
}

/** paginate through `notion.blocks.children.list` for a page */
async function retrieveAll(notion: NotionHq.Client, page: string) {
  debug('retrieveAll page=%o', page)

  let res = await notion.blocks.children.list({ block_id: page })
  let all = res.results

  while (res.next_cursor !== null) {
    debug('retrieveAll page=%o next=%o', page, res.next_cursor)

    res = await notion.blocks.children.list({
      block_id: page,
      start_cursor: res.next_cursor,
    })

    all = all.concat(res.results)
  }

  return all
}

// run once and output stdout to this file
// run again with localFile set to that file to skip notion API calls
type FetchSchedulePullMode = 'schedule' | 'content' | 'settings'
export interface FetchScheduleCommandOptions {
  localFile?: string
  only?: FetchSchedulePullMode[]
  imageDir: string
  quiet: boolean
}

export async function fetchScheduleCommand(
  options: FetchScheduleCommandOptions
) {
  debug('checking env')
  const { NOTION_TOKEN, REDIS_URL } = mask(
    process.env,
    object({
      NOTION_TOKEN: string(),
      REDIS_URL: string(),
    })
  )

  const config = await loadConfig()
  const store = new RedisService(REDIS_URL)

  debug('creating client')
  const notion = new NotionHq.Client({
    auth: NOTION_TOKEN,
  })

  const content: Record<string, NotionPage[]> = {}

  function pull(mode: FetchSchedulePullMode) {
    return (
      !options.only || options.only.length === 0 || options.only.includes(mode)
    )
  }

  if (options.localFile) {
    debug('localFile=%o', options.localFile)
    Object.assign(
      content,
      JSON.parse(await fs.readFile(options.localFile, 'utf8'))
    )
  } else {
    debug('using notion API')
    const keys: Record<string, string> = {}

    if (pull('schedule')) {
      keys.sessions = config.notion.db.sessions
      keys.themes = config.notion.db.themes
      keys.tracks = config.notion.db.tracks
      keys.types = config.notion.db.types
      keys.speakers = config.notion.db.speakers
    }

    if (pull('content')) {
      keys.content = config.notion.db.content
    }

    for (const [key, db] of Object.entries(keys)) {
      content[key] = await queryAll(notion, db)
    }
  }

  // A map of notion image id to local path
  const images = new Map<string, string>()

  if (pull('schedule')) {
    await processSchedule(content, store, images)
  }

  if (pull('settings')) {
    await store.put('schedule.settings', config.settings)
  }

  if (pull('content')) {
    await processContent(content, store, images)
  }

  if (options.quiet === false) {
    console.log(JSON.stringify(content, null, 2))
  }

  await store.close()
}

function getImage(images: Map<string, string>, some: any) {
  // ...
}

async function processContent(
  content: Record<string, NotionPage[]>,
  store: RedisService,
  images: Map<string, string>
) {
  const contentService = new ContentService({
    store,
    contentRepo: new ContentRepository({}),
  })

  // Put any content we find into the content section
  // TODO: english only for now
  for (const page of content.content) {
    const slug = fmt.title(page.props.Name)?.trim()
    const content = getMarkdown(page.blocks)
    if (!slug || !content) continue
    await store.put(`content.${slug}`, {
      en: contentService.processMarkdown(content),
    })
  }
}

async function processSchedule(
  content: Record<string, NotionPage[]>,
  store: RedisService,
  images: Map<string, string>
) {
  const themes: Theme[] = content.themes.map((page) => ({
    id: page.id,
    title: {
      en: fmt.title(page.props.Name),
    },
  }))

  const tracks: Track[] = content.tracks.map((page) => ({
    id: page.id,
    title: {
      en: fmt.title(page.props.Name),
    },
  }))

  const speakers: Speaker[] = content.speakers.map((page) => ({
    id: page.id,
    name: fmt.title(page.props.Name),
    role: { en: fmt.richText(page.props.Role) },
    bio: { en: getMarkdown(page.blocks) },
    // headshot: page.props.Headshot?.files?.[0]?.file?.url, // TODO
    headshot: '/img/headshot.svg',
  }))

  const types: SessionType[] = content.types.map((page) => ({
    id: page.id,
    iconGroup: fmt.richText(page.props.IconGroup) ?? 'fas',
    iconName: fmt.richText(page.props.IconName) ?? 'object-group',
    layout: fmt.select(page.props.Layout) ?? 'plenary',
    title: {
      en: fmt.title(page.props.Name),
    },
  }))

  const slotMap = new Map<string, SessionSlot>()
  for (const page of content.sessions) {
    const slot = fmt.slot(
      page.props.Date?.date.start,
      page.props.Date?.date.end
    )
    if (slot) slotMap.set(slot.id, slot)
  }
  const slots = Array.from(slotMap.values())

  const sessions: Session[] = content.sessions.map((page) => {
    return {
      id: page.id,
      type: fmt.relationIds(page.props.Type)[0],
      slot: fmt.slot(page.props.Date?.date.start, page.props.Date?.date.end)
        ?.id,
      track: fmt.relationIds(page.props.Track)[0],
      themes: fmt.relationIds(page.props.Themes),
      title: {
        en: fmt.title(page.props.Name),
      },
      content: {
        en: getMarkdown(page.blocks),
      },
      links: [],
      hostLanguages: fmt.multiSelect(page.props.Languages) ?? ['en'],
      enableInterpretation: false,
      speakers: fmt.relationIds(page.props.Speakers),
      hostOrganisation: {
        en: 'PDC 2022',
      },
      isRecorded: fmt.checkbox(page.props.IsRecorded),
      isOfficial: false,
      isFeatured: fmt.checkbox(page.props.Featured),
      visibility: SessionVisibility.public,
      state: fmt.select(page.props.State) ?? 'draft',
      participantCap: null,
      hideFromSchedule: false,
    }
  })

  await store.put('schedule.themes', themes)
  await store.put('schedule.types', types)
  await store.put('schedule.tracks', tracks)
  await store.put('schedule.speakers', speakers)
  await store.put('schedule.sessions', sessions)
  await store.put('schedule.slots', slots)
}
