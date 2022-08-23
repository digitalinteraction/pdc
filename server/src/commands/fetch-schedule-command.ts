import { promisify } from 'util'
import stream from 'stream'
import { createWriteStream } from 'fs'
import path from 'path'
import fs from 'fs/promises'
import {
  defaulted,
  mask,
  nullable,
  object,
  optional,
  string,
} from 'superstruct'

import {
  LocalisedLink,
  Session,
  SessionSlot,
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

import {
  loadConfig,
  createDebug,
  NotionPage,
  notionFmt as fmt,
  NotionRenderContext,
  UrlService,
  NotionService,
  RegisteredUsers,
  trimEmail,
  sha256UrlHash,
  getS3ClientFromEnv,
  S3Client,
} from '../lib/module.js'
import got from 'got'

const pipeline = promisify(stream.pipeline)
const debug = createDebug('cmd:fetch-schedule')

type FetchSchedulePullMode =
  | 'schedule'
  | 'content'
  | 'settings'
  | 'registrations'
  | 'places'
  | 'papers'

export interface FetchScheduleCommandOptions {
  localFile?: string
  only?: FetchSchedulePullMode[]
  staticDir: string
  quiet: boolean
  skipFiles: boolean
}

// run once and output stdout to this file "> notion.json"
// run again with localFile set to that file to skip notion API calls "--localFile=notion.json"
export async function fetchScheduleCommand(
  options: FetchScheduleCommandOptions
) {
  debug('checking env')
  const { NOTION_TOKEN, REDIS_URL, CLIENT_URL, SELF_URL, STATIC_URL } = mask(
    process.env,
    object({
      NOTION_TOKEN: string(),
      REDIS_URL: string(),
      CLIENT_URL: string(),
      SELF_URL: string(),
      STATIC_URL: nullable(defaulted(string(), null)),
    })
  )

  debug('creating services')
  const config = await loadConfig()
  const store = new RedisService(REDIS_URL)
  const env = { CLIENT_URL, SELF_URL, STATIC_URL }
  const url = new UrlService({ env })
  const s3 = getS3ClientFromEnv()
  const notion = new NotionService({
    url,
    options: {
      notionToken: NOTION_TOKEN,
    },
  })

  if (s3) debug('using S3 bucket=%o', s3.bucketName)

  debug('ensuring folder %o', options.staticDir)
  await fs.mkdir(options.staticDir, { recursive: true })

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

    if (pull('registrations')) {
      keys.registrations = config.notion.db.registrations
    }

    if (pull('content')) {
      keys.content = config.notion.db.content
    }

    if (pull('places')) {
      keys.places = config.notion.db.places
    }

    if (pull('papers')) {
      keys.papers = config.notion.db.papers
    }

    for (const [key, db] of Object.entries(keys)) {
      content[key] = await notion.queryNotionDatabase(db)
    }
  }

  // A map of notion image id to local path
  const ctx = await createRenderContext(options.staticDir, url, s3)
  const existingFiles = new Set(ctx.files.keys())

  if (pull('schedule')) {
    await processSchedule(content, store, notion, ctx)
  }

  if (pull('settings')) {
    await store.put('schedule.settings', config.settings)
  }

  if (pull('registrations')) {
    await processRegistrations(content, store)
  }

  if (pull('content')) {
    await processContent(content, store, notion, ctx)
  }

  if (pull('places')) {
    await processPlaces(content, store, notion, ctx)
  }

  if (pull('papers')) {
    await processPapers(content, store, notion, ctx)
  }

  if (options.quiet === false && !options.localFile) {
    console.log(JSON.stringify(content, null, 2))
  }

  if (ctx.files.size > 0 && options.skipFiles !== true) {
    debug('processing files')
    downloadFiles(options.staticDir, ctx, existingFiles, s3)
  }

  await store.close()

  debug('done')
}

/**
 * Create a context for rendering notion files to markdown,
 * pre-cache existing images so they don't need to be redownloaded
 */
async function createRenderContext(
  baseDir: string,
  url: UrlService,
  s3: S3Client | null
) {
  const ctx: NotionRenderContext = {
    files: new Map(),
  }

  // If using S3, list files we don't need to download again
  if (s3) {
    debug('#createRenderContext loading notion filenames')
    const found = await s3.list('notion/')

    for (const file of found) {
      const filename = file.name.replace('notion/', '')

      ctx.files.set(filename, {
        originalUrl: '',
        newUrl: url.getNotionFile(filename).toString(),
        filename,
      })
    }
  } else {
    debug('#createRenderContext loading static filenames')
    // If not using notion, prefil based on the "static" local directory
    for (const filename of await fs.readdir(baseDir)) {
      ctx.files.set(filename, {
        originalUrl: '',
        newUrl: url.getNotionFile(filename).toString(),
        filename,
      })
    }
  }

  return ctx
}

/** Download notion files into the static directory, skipping ones that are already present */
async function downloadFiles(
  baseDir: string,
  ctx: NotionRenderContext,
  existingFiles: Set<string>,
  s3: S3Client | null
) {
  for (const value of ctx.files.values()) {
    if (existingFiles.has(value.filename)) {
      debug('skip download %o', value.filename)
      continue
    }

    debug('download %o', value.originalUrl)
    try {
      const newPath = path.join(baseDir, value.filename)
      await pipeline(got.stream(value.originalUrl), createWriteStream(newPath))

      if (s3) {
        const key = path.join('notion', value.filename)
        debug(' → upload to %o', key)
        await s3.client.fPutObject(s3.bucketName, key, newPath, {
          'x-amz-acl': 'public-read',
        })
      }
    } catch (error) {
      console.error('Failed to download %o', value.originalUrl)
      throw error
    }
  }
}

/** Process the content/copy from notion and put into the store */
async function processContent(
  content: Record<string, NotionPage[]>,
  store: RedisService,
  notion: NotionService,
  ctx: NotionRenderContext
) {
  const contentService = new ContentService({
    store,
    contentRepo: new ContentRepository({}),
  })

  // Put any content we find into the content section
  for (const page of content.content) {
    const slug = fmt.title(page.props.Name)?.trim()
    const content = notion.getPageMarkdown(page.blocks, ctx)
    if (!slug || !content) continue
    await store.put(`content.${slug}`, {
      en: contentService.processMarkdown(content),
    })
  }
}

async function processRegistrations(
  content: Record<string, NotionPage[]>,
  store: RedisService
) {
  const emptyString = sha256UrlHash('')
  const records: RegisteredUsers[] = content.registrations
    .map((page) => ({
      name: fmt.title(page.props.Name),
      email: sha256UrlHash(trimEmail(fmt.email(page.props.Email))),
    }))
    .filter((r) => r.email !== emptyString)

  await store.put('registration.users', records)
}

async function processPapers(
  content: Record<string, NotionPage[]>,
  store: RedisService,
  notion: NotionService,
  ctx: NotionRenderContext
) {
  const onCommas = () => /\s*[,&]\s*/

  const papers = content.papers.map((page) => ({
    id: page.id,
    title: fmt.title(page.props.Name),
    _title: fmt.title(page.props.Name).replace(/\W/g, ''),
    themes: fmt.relationIds(page.props.Themes),
    keywords: fmt.richText(page.props.Keywords).split(onCommas()),
    authors: fmt.richText(page.props.Authors).split(onCommas()),
    content: notion.getPageMarkdown(page.blocks, ctx),
    sessionId: fmt.relationIds(page.props.Session)[0] ?? null,
    files: page.props.Files?.files?.map((f: any) => notion.getFileUrl(f, ctx)),
  }))
  papers.sort((a, b) => a._title.localeCompare(b._title))
  for (const p of papers) delete p._title

  await store.put('schedule.papers', papers)
}

async function processPlaces(
  content: Record<string, NotionPage[]>,
  store: RedisService,
  notion: NotionService,
  ctx: NotionRenderContext
) {
  const places = content.places.map((page) => ({
    id: page.id,
    title: fmt.title(page.props.Name),
    sessions: fmt.relationIds(page.props.Sessions),
    content: notion.getPageMarkdown(page.blocks, ctx),
  }))
  places.sort((a, b) => a.title.localeCompare(b.title))

  await store.put('schedule.places', places)
}

/** Process the schedule resources and put them into the store */
async function processSchedule(
  content: Record<string, NotionPage[]>,
  store: RedisService,
  notion: NotionService,
  ctx: NotionRenderContext
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

  const getHeadshot = (page: any) => {
    const url = page.props.Headshot?.files?.[0]?.file?.url
    if (!url) return '/img/headshot.webp'
    return notion.getFile(url, ctx)
  }

  const speakers: Speaker[] = content.speakers.map((page) => ({
    id: page.id,
    name: fmt.title(page.props.Name),
    role: { en: fmt.richText(page.props.Role) },
    bio: { en: notion.getPageMarkdown(page.blocks, ctx) },
    headshot: getHeadshot(page),
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
      page.props.Date?.date?.start,
      page.props.Date?.date?.end
    )
    if (slot) slotMap.set(slot.id, slot)
  }
  const slots = Array.from(slotMap.values())

  const getLinks = (page: any): LocalisedLink[] => {
    return page.props.Links?.files
      ?.map((f: any) => notion.getFileUrl(f, ctx))
      .filter((url: any) => Boolean(url))
      .map((url: string) => ({ type: '', url, title: '', language: 'en' }))
  }

  const sessions: Session[] = content.sessions.map((page) => {
    return {
      id: page.id,
      type: fmt.relationIds(page.props.Type)[0],
      slot: fmt.slot(page.props.Date?.date?.start, page.props.Date?.date?.end)
        ?.id,
      track: fmt.relationIds(page.props.Track)[0],
      themes: fmt.relationIds(page.props.Themes),
      title: {
        en: fmt.title(page.props.Name),
      },
      content: {
        en: notion.getPageMarkdown(page.blocks, ctx),
      },
      coverImage: notion.getFileUrl(page.cover, ctx),
      links: getLinks(page),
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

  sessions.sort((a, b) => {
    if (!a.slot || !b.slot) return 0
    return a.slot.localeCompare(b.slot)
  })

  await store.put('schedule.themes', themes)
  await store.put('schedule.types', types)
  await store.put('schedule.tracks', tracks)
  await store.put('schedule.speakers', speakers)
  await store.put('schedule.sessions', sessions)
  await store.put('schedule.slots', slots)
}
