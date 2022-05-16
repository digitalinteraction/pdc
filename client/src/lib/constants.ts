// TODO: trim these

export enum StorageKey {
  AuthToken = 'authToken',
  Analytics = 'analyticsConsent',
  Locale = 'chosenLocale',
  ScheduleFilters = 'scheduleFilters',
  MisinfoConFilters = 'misinfoConFilters',
  HouseEventsFilters = 'houseEventsFilters',
  ArtFilters = 'artFilters',
  SkillShareFilters = 'skillShareFilters',
  FringeEventsFilters = 'fringeEventsFilters',
  WhatsOnFilters = 'whatsOnFilters',
  EmergentSessionsFilters = 'emergentSessionsFilters',
}

export enum ExtraRoutes {
  Spaces = 'spaces',
  SkillShare = 'skill-share',
  Arts = 'art-gallery',
  Fringe = 'fringe',
  House = 'house',
  MisinfoCon = 'misinfoCon',
  EmergentInfo = 'emergentInfo',
  EmergentSessions = 'emergentSessions',
}

export const themeAllowlist = new Set([
  'arts--culture',
  'data-stewardship',
  'governance--policy',
  'decentralization',
  'openness--transparency',
  'health',
  'privacy--security',
  'education',
  'speech--language',
  'zine-fair--exhibit',
  'intersectionality',
  'mozilla-fellows--awardees',
  'bias',
  'web-monetized',
  'diversity--inclusion',
  'platforms--software',
  'movement-building',
  'science',
  'web-literacy',
])
