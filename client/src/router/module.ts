import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import i18n from '../i18n/module'

import AtriumView from '../views/AtriumView.vue'
import TokenCaptureView from '../views/TokenCaptureView.vue'
import ApiErrorView from '../views/ApiErrorView.vue'
import NotFoundView from '../views/NotFoundView.vue'

import {
  createPageViewEvent,
  getRouteTitle,
  getScrollBehaviour,
  Routes,
} from '@openlab/deconf-ui-toolkit'
import { ExtraRoutes, StorageKey } from '@/lib/module'
import { MetricsPlugin } from '@/plugins/metrics-plugin'
import { env } from '@/plugins/env-plugin'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  //
  // CORE routes
  //
  {
    path: '/',
    redirect: { name: Routes.Atrium },
  },
  {
    path: '/atrium',
    name: Routes.Atrium,
    component: AtriumView,
    meta: {
      pageTitle: 'pdc.pageTitles.atrium',
    },
  },
  {
    path: '/_auth',
    name: Routes.TokenCapture,
    component: TokenCaptureView,
  },

  //
  // Auth routes
  //
  {
    path: '/login',
    name: Routes.Login,
    component: () =>
      import(/* webpackChunkName: "registration" */ '../views/LoginView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.login',
    },
  },
  {
    path: '/registration',
    name: Routes.Register,
    component: () =>
      import(
        /* webpackChunkName: "registration" */ '../views/RegisterView.vue'
      ),
  },
  {
    path: '/profile',
    name: Routes.Profile,
    component: () =>
      import(/* webpackChunkName: "registration" */ '../views/ProfileView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.profile',
    },
  },

  //
  // SCHEDULE
  //
  {
    path: '/programme',
    name: Routes.Schedule,
    component: () =>
      import(/* webpackChunkName: "schedule" */ '../views/ScheduleView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.schedule',
    },
  },
  {
    path: '/newcastle',
    name: ExtraRoutes.Newcastle,
    component: () =>
      import(/* webpackChunkName: "schedule" */ '../views/NewcastleView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.session',
    },
  },
  {
    path: '/keynotes',
    name: ExtraRoutes.Keynotes,
    component: () =>
      import(/* webpackChunkName: "schedule" */ '../views/KeynotesView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.keynotes',
    },
  },
  {
    path: '/places',
    name: ExtraRoutes.Places,
    component: () =>
      import(/* webpackChunkName: "schedule" */ '../views/PlacesView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.places',
    },
  },
  {
    path: '/places/:placeId',
    name: ExtraRoutes.PlaceDetail,
    props: true,
    component: () =>
      import(/* webpackChunkName: "schedule" */ '../views/PlaceDetailView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.places',
    },
  },

  //
  // Session
  //
  {
    path: '/session/:sessionId',
    name: Routes.Session,
    props: true,
    component: () =>
      import(/* webpackChunkName: "session" */ '../views/SessionView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.session',
    },
  },
  {
    path: '/keynotes/:sessionId',
    name: ExtraRoutes.KeynoteSession,
    props: true,
    component: () =>
      import(/* webpackChunkName: "session" */ '../views/SessionView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.session',
    },
  },
  {
    path: '/places/:placeId/session/:sessionId',
    name: ExtraRoutes.PlacesSession,
    props: true,
    component: () =>
      import(/* webpackChunkName: "session" */ '../views/SessionView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.session',
    },
  },

  //
  // Papers
  //
  {
    path: '/papers',
    name: ExtraRoutes.Papers,
    component: () =>
      import(/* webpackChunkName: "papers" */ '../views/PapersView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.papers',
    },
  },
  {
    path: '/papers/:paperId',
    name: ExtraRoutes.PaperDetail,
    props: true,
    component: () =>
      import(/* webpackChunkName: "papers" */ '../views/PaperDetailView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.papers',
    },
  },

  //
  // Static
  //
  {
    path: '/social',
    name: ExtraRoutes.Social,
    component: () =>
      import(/* webpackChunkName: "static" */ '../views/SocialView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.social',
    },
  },
  {
    path: '/help',
    name: Routes.HelpDesk,
    component: () =>
      import(/* webpackChunkName: "static" */ '../views/HelpView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.session',
    },
  },
  {
    path: '/privacy',
    name: Routes.Privacy,
    component: () =>
      import(/* webpackChunkName: "static" */ '../views/PrivacyView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.privacy',
    },
  },
  {
    path: '/terms',
    name: Routes.Terms,
    component: () =>
      import(/* webpackChunkName: "static" */ '../views/TermsView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.terms',
    },
  },
  {
    path: '/about',
    name: ExtraRoutes.About,
    component: () =>
      import(/* webpackChunkName: "static" */ '../views/AboutView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.about',
    },
  },
  {
    path: '/calendar-help',
    name: ExtraRoutes.CalendarHelp,
    component: () =>
      import(/* webpackChunkName: "static" */ '../views/CalendarHelpView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.calendarHelp',
    },
  },

  //
  // Errors
  //
  {
    path: '/error/:errorCode',
    props: true,
    name: Routes.Error,
    component: ApiErrorView,
  },
  {
    path: '/error',
    component: ApiErrorView,
  },
  {
    path: '/not-found',
    name: Routes.NotFound,
    component: NotFoundView,
  },
  {
    path: '*',
    component: NotFoundView,
  },
]

// 5.25rem into pixels ($navbar-height + tabbar height)
const scrollBehavior = getScrollBehaviour(80)

const protectedRoutes = new Set<string>([Routes.Profile])

const router = new VueRouter({
  mode: env.STATIC_BUILD ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior,
})

router.beforeEach((to, from, next) => {
  document.title = getRouteTitle(to, i18n)

  const loggedIn = Boolean(localStorage.getItem(StorageKey.AuthToken))

  MetricsPlugin.shared?.track(
    createPageViewEvent(to.name ?? to.path, to.params)
  )

  if (!loggedIn && to.name && protectedRoutes.has(to.name)) {
    next({ name: Routes.Atrium })
  } else {
    next()
  }
})

export default router
