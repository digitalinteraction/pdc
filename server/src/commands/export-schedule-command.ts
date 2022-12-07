import path from 'path'
import fs from 'fs/promises'

import {
  CarbonRoutes,
  ConferenceRoutes,
  ContentRoutes,
} from '@openlab/deconf-api-toolkit'
import { Localised, LocalisedLink } from '@openlab/deconf-shared'

import { createDebug } from '../lib/utils.js'
import { createServerContext } from './serve-command.js'
import { AppConfig } from '../lib/module.js'

const debug = createDebug('cmd:export-schedule')

export interface ExportScheduleCommandOptions {
  destination: string
}

export async function exportScheduleCommand(
  options: ExportScheduleCommandOptions
) {
  debug('start')
  const context = await createServerContext()

  const contentRoutes = new ContentRoutes(context)
  const conferenceRoutes = new ConferenceRoutes({
    ...context,
    config: undefined,
  })

  const schedule = await conferenceRoutes.getSchedule()

  const links: Record<string, LocalisedLink[]> = {}
  for (const session of await context.conferenceRepo.getSessions()) {
    if (session.links.length > 0) links[session.id] = session.links
  }

  const content: Record<string, Localised> = {}
  for (const key of context.config.content.keys) {
    content[key] = await contentRoutes.getContent(key).then((r) => r.content)
  }

  const places = await context.store.retrieve('schedule.places')
  const papers = await context.store.retrieve('schedule.papers')
  const attendance = Object.fromEntries(
    await context.attendanceRepo.getSessionAttendance()
  )

  //
  // Modify the settings
  //
  const settings: AppConfig['settings'] = schedule.settings as any
  settings.navigation.showLogin = false
  settings.navigation.showProfile = false
  settings.navigation.showRegister = false
  settings.widgets.siteVisitors = false
  settings.widgets.login = false
  settings.widgets.register = false
  settings.widgets.calendarHelp = false

  //
  // Once all data is fetch, write it to files
  //
  const files = { schedule, links, content, places, papers, attendance }

  const dir = await fs.stat(options.destination).catch(() => null)
  if (!dir) await fs.mkdir(options.destination, { recursive: true })

  for (const [file, data] of Object.entries(files)) {
    await fs.writeFile(
      path.join(options.destination, `${file}.json`),
      JSON.stringify(data)
    )
  }

  // Shut down
  await context.store.close()
  await context.postgres.close()
}
