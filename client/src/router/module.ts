import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'
import i18n from '../i18n/module'

import AtriumView from '../views/AtriumView.vue'
import TokenCaptureView from '../views/TokenCaptureView.vue'
import ApiErrorView from '../views/ApiErrorView.vue'
import NotFoundView from '../views/NotFoundView.vue'

import { createPageViewEvent, Routes } from '@openlab/deconf-ui-toolkit'
import { ExtraRoutes, StorageKey } from '@/lib/module'
import { MetricsPlugin } from '@/plugins/metrics-plugin'

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
    path: '/places/:placeId/:sessionId',
    name: ExtraRoutes.PlacesSession,
    props: true,
    component: () =>
      import(/* webpackChunkName: "session" */ '../views/SessionView.vue'),
    meta: {
      pageTitle: 'pdc.pageTitles.session',
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

function getRouteTitle(route: Route): string {
  const routeWithTitle = [...route.matched]
    .reverse()
    .find((r) => r.meta.pageTitle)

  const appName = i18n.t('pdc.general.appName') as string

  if (routeWithTitle) {
    const pageName = i18n.t(routeWithTitle.meta.pageTitle)
    return [pageName, appName].join(' | ')
  }

  return appName
}

// 5.25rem into pixels ($navbar-height + tabbar height)
const SCROLL_OFFSET = 80

function scrollBehavior(
  to: Route,
  from: Route,
  savedPosition: { x: number; y: number } | void
) {
  // If they clicked on a hash, scroll to that
  if (to.hash && to.name !== Routes.TokenCapture) {
    return {
      selector: to.hash,
      offset: { x: 0, y: SCROLL_OFFSET },
    }
  }

  // If they've been to the page, scroll back to there
  // Only available when navigating back via the browser
  if (savedPosition) return savedPosition

  // Otherwise, its a new page so go to the top
  return { x: 0, y: 0 }
}

const protectedRoutes = new Set<string>([Routes.Profile])

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior,
})

router.beforeEach((to, from, next) => {
  document.title = getRouteTitle(to)

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
