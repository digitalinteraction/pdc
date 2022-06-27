<template>
  <AppLayout v-if="place" class="placeDetailView">
    <div class="placesDetailView-extraTop">
      <router-link class="backLink" :to="placesRoute">
        <span class="icon">
          <fa-icon :icon="['fas', 'arrow-left']" />
        </span>
        <span> Back to places </span>
      </router-link>
    </div>
    <WhatsOnView
      :schedule="filteredSchedule"
      :sessions="filteredSessions"
      filters-key="pdcPlacesViewFilters"
      :enabled-filters="enabledFilters"
      :config="config"
      slot-state="future"
      :language-options="languages"
      :url-filters="urlFilters"
      @filter="onFilter"
      :readonly="readonly"
    >
      <span slot="title">{{ place.title }}</span>
      <div slot="info" class="content" v-html="placeContent"></div>
      <span slot="noResults">{{ $t('pdc.general.noResults') }}</span>
    </WhatsOnView>
  </AppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import AppLayout from '@/components/PdcAppLayout.vue'
import {
  decodeUrlScheduleFilters,
  filterScheduleFromSessions,
  ScheduleConfig,
  ScheduleFilterRecord,
  SelectOption,
  WhatsOnView,
} from '@openlab/deconf-ui-toolkit'
import {
  ExtraRoutes,
  getLanguageOptions,
  guardRoute,
  mapApiState,
  mapPlacesState,
} from '@/lib/module'
import { ScheduleRecord, Session } from '@openlab/deconf-shared/dist/conference'
import { PlaceRecord } from '@/store/places-module'
import { RawLocation } from 'vue-router'
import { marked } from 'marked'

interface Data {
  enabledFilters: Array<keyof ScheduleFilterRecord>
  config: ScheduleConfig
  languages: SelectOption[]
  urlFilters: ScheduleFilterRecord | null
}

export default Vue.extend({
  components: { AppLayout, WhatsOnView },
  props: {
    placeId: { type: String, required: true },
  },
  data(): Data {
    return {
      enabledFilters: ['query', 'theme', 'language'],
      config: {
        tileHeader: ['type'],
        tileAttributes: ['themes', 'languages'],
        getSessionRoute: (session) => ({
          name: ExtraRoutes.PlacesSession,
          params: {
            sessionId: session.id,
            placeId: this.placeId,
          },
        }),
      },
      languages: getLanguageOptions(),
      urlFilters: decodeUrlScheduleFilters(this.$route.query),
    }
  },
  computed: {
    ...mapPlacesState('places', ['places']),
    ...mapApiState('api', ['schedule', 'user', 'userSessions']),
    place(): PlaceRecord | null {
      return this.places?.find((p) => p.id === this.placeId) ?? null
    },
    placesRoute(): RawLocation {
      return { name: ExtraRoutes.Places }
    },
    placeContent(): string | null {
      return this.place ? marked(this.place.content) : null
    },
    scheduleDate(): Date {
      return this.$dev?.scheduleDate ?? this.$temporal.date
    },
    filteredSessions(): Session[] {
      if (!this.schedule || !this.place) return []
      const sessions = new Map(this.schedule.sessions.map((s) => [s.id, s]))
      return this.place.sessions
        .map((id) => sessions.get(id) as Session)
        .filter((s) => s)
    },
    filteredSchedule(): ScheduleRecord | null {
      if (!this.schedule) return null
      return filterScheduleFromSessions(
        this.schedule as any,
        this.filteredSessions
      )
    },
    scheduleIsLive(): boolean {
      return Boolean(this.schedule?.settings?.schedule?.enabled)
    },
    readonly(): boolean {
      return Boolean(this.schedule?.settings?.places?.readonly)
    },
  },
  created() {
    guardRoute(this.schedule?.settings.places, this.user, this.$router)
    this.$store.dispatch('places/fetch')
  },
  methods: {
    onFilter(query: any) {
      this.$router.replace({ query })
    },
  },
})
</script>

<style lang="scss">
.placeDetailView {
  .whatsOnView {
    background-color: $background;
  }

  .scheduleFilters {
    display: none;
  }

  .backLink {
    text-decoration: underline;
    color: $black;
    font-weight: bold;
    display: flex;
  }
}
.placesDetailView-extraTop {
  flex: 0 !important;
  padding: 0.5rem $block-spacing 0;
}
</style>
