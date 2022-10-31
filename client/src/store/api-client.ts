import { EnvRecord } from '@/plugins/env-plugin'
import {
  CarbonCalculation,
  LocalisedContent,
  LocalisedLink,
  PrivateCalendar,
  ScheduleRecord,
  SessionLinks,
  UserAttendance,
  UserRegistration,
  UserSessionAttendance,
} from '@openlab/deconf-shared'
import { DeconfApiClient } from '@openlab/deconf-ui-toolkit'
import { PaperRecord } from './papers-module'
import { PlaceRecord } from './places-module'

interface StaticFiles {
  'attendance.json': Record<string, number | undefined>
  'schedule.json': ScheduleRecord // Not really a ScheduleRecord but bad types
  'links.json': Record<string, LocalisedLink[] | undefined>
  'content.json': Record<string, LocalisedContent | undefined>
  'places.json': PlaceRecord[]
  'papers.json': PaperRecord[]
}

export function pickApi(env: EnvRecord) {
  return env.STATIC_BUILD
    ? new StaticApiClient(env.SERVER_URL.href)
    : new PdcApiClient(env.SERVER_URL.href)
}

//
// PDC Extension
//
export class PdcApiClient extends DeconfApiClient {
  getPapers() {
    return this.fetchJson('papers')
  }
  getPlaces() {
    return this.fetchJson('places')
  }
}

//
// Static alternative
//
export class StaticApiClient extends PdcApiClient {
  staticFiles = new Map<string, unknown>()

  async getStaticFile<K extends keyof StaticFiles>(path: K) {
    if (!this.staticFiles.has(path)) {
      this.staticFiles.set(path, await this.fetchJson(path))
    }
    return this.staticFiles.get(path) as StaticFiles[K]
  }

  //
  // Attendance
  //
  override async attend(): Promise<boolean> {
    return false
  }
  override async unattend(): Promise<boolean> {
    return false
  }
  override async getSessionAttendance(
    sessionId: string
  ): Promise<UserSessionAttendance | null> {
    const attendance = await this.getStaticFile('attendance.json')
    return {
      isAttending: false,
      sessionCount: attendance[sessionId] ?? 0,
    }
  }
  override async getUserAttendance(): Promise<UserAttendance | null> {
    return { attendance: [] }
  }

  //
  // Carbon?
  //
  override getCarbon(): Promise<CarbonCalculation | null> {
    throw new Error('Not implemented')
  }

  //
  // Calendar?
  //
  override createUserCalendar(): Promise<PrivateCalendar | null> {
    throw new Error('Not implemented')
  }

  //
  // Conference
  //
  override getSchedule(): Promise<ScheduleRecord | null> {
    return this.getStaticFile('schedule.json')
  }
  override async getLinks(sessionId: string): Promise<SessionLinks | null> {
    const links = await this.getStaticFile('links.json')
    return { links: links[sessionId] ?? [] }
  }

  //
  // Content
  //
  override async getContent(slug: string): Promise<LocalisedContent | null> {
    const content = await this.getStaticFile('content.json')
    return content[slug] ?? null
  }

  //
  // Registration
  //
  override getRegistration(): Promise<UserRegistration | null> {
    throw new Error('Not implemented')
  }
  override startEmailLogin(): Promise<boolean> {
    throw new Error('Not implemented')
  }
  override startRegister(): Promise<boolean> {
    throw new Error('Not implemented')
  }
  override unregister(): Promise<boolean> {
    throw new Error('Not implemented')
  }

  //
  // PDC custom
  //
  override getPapers() {
    return this.getStaticFile('papers.json')
  }
  override getPlaces() {
    return this.getStaticFile('places.json')
  }
}
