<template>
  <AppLayout v-if="session">
    <SessionView
      api-module="api"
      :session="session"
      :schedule="schedule"
      :logged-in="Boolean(user)"
      :schedule-date="scheduleDate"
      class="appLayout-main"
    >
      <BackButton slot="backButton" :to="backRoute">
        {{ $t('deconf.session.pdc.backButton') }}
      </BackButton>

      <img
        v-if="session.coverImage"
        class="sessionView-coverImage"
        slot="beforeHeader"
        :src="session.coverImage"
      />

      <template v-if="localeContent" slot="content">
        <div class="content" v-html="localeContent"></div>
      </template>
    </SessionView>
  </AppLayout>
  <NotFoundView v-else />
</template>

<script lang="ts">
import Vue from 'vue'
import { marked } from 'marked'
import { Location } from 'vue-router'

import AppLayout from '@/components/PdcAppLayout.vue'
import { Session } from '@openlab/deconf-shared'
import {
  BackButton,
  localiseFromObject,
  Routes,
  SessionView,
} from '@openlab/deconf-ui-toolkit'

import NotFoundView from '@/views/NotFoundView.vue'
import { ExtraRoutes, mapApiState } from '@/lib/module'

export default Vue.extend({
  components: { AppLayout, SessionView, BackButton, NotFoundView },
  props: {
    sessionId: { type: String, required: true },
    placeId: { type: String, required: false },
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user']),
    session(): Session | null {
      if (!this.schedule) return null
      return this.schedule.sessions.find((s) => s.id === this.sessionId) ?? null
    },
    backRoute(): Location {
      if (this.$route.name === ExtraRoutes.KeynoteSession) {
        return { name: ExtraRoutes.Keynotes }
      }
      if (this.$route.name === ExtraRoutes.PlacesSession) {
        if (this.placeId) {
          return {
            name: ExtraRoutes.PlaceDetail,
            params: { placeId: this.placeId },
          }
        }
      }
      return { name: Routes.Schedule }
    },
    scheduleDate(): Date {
      return this.$dev.scheduleDate ?? this.$temporal.date
    },
    localeContent(): string | null {
      if (!this.session) return null
      const md = localiseFromObject(this.$i18n.locale, this.session.content)
      if (!md) return null
      return marked(md)
    },
  },
})
</script>

<style lang="scss">
.sessionView-coverImage {
  width: 100%;
  aspect-ratio: 3 / 1;
  object-fit: cover;
  border-radius: 4px;
}
</style>
