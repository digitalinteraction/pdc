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
  {
    path: '/',
    redirect: { name: Routes.Atrium },
  },
  {
    path: '/plaza',
    name: Routes.Atrium,
    component: AtriumView,
    meta: {
      pageTitle: 'mozfest.pageTitles.atrium',
    },
  },
  {
    path: '/_auth',
    name: Routes.TokenCapture,
    component: TokenCaptureView,
  },
]

function getRouteTitle(route: Route): string {
  const routeWithTitle = [...route.matched]
    .reverse()
    .find((r) => r.meta.pageTitle)

  const appName = i18n.t('mozfest.general.appName') as string

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
