<template>
  <AppLayout class="placesView">
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
      :readonly="false"
    >
      <span slot="title">{{ $t('pdc.pageTitles.places') }}</span>
      <ApiContent slot="info" slug="places-filters" />
      <span slot="noResults">{{ $t('pdc.general.noResults') }}</span>
    </WhatsOnView>
  </AppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import AppLayout from '@/components/PdcAppLayout.vue'
import {
  ApiContent,
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
} from '@/lib/module'
import { ScheduleRecord, Session } from '@openlab/deconf-shared/dist/conference'

const predicate = (session: Session) => {
  return session.track === 'fb858d34-9492-4596-b5e9-20b9a6e035f2'
}

interface Data {
  enabledFilters: Array<keyof ScheduleFilterRecord>
  config: ScheduleConfig
  languages: SelectOption[]
  urlFilters: ScheduleFilterRecord | null
}

export default Vue.extend({
  components: { AppLayout, WhatsOnView, ApiContent },
  data(): Data {
    return {
      enabledFilters: ['query', 'theme', 'language'],
      config: {
        tileHeader: ['type'],
        tileAttributes: ['themes', 'languages'],
        getSessionRoute(session) {
          return {
            name: ExtraRoutes.PlacesSession,
            params: { sessionId: session.id },
          }
        },
      },
      languages: getLanguageOptions(),
      urlFilters: decodeUrlScheduleFilters(this.$route.query),
    }
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user', 'userSessions']),
    scheduleDate(): Date {
      return this.$dev?.scheduleDate ?? this.$temporal.date
    },
    filteredSessions(): Session[] {
      return this.schedule?.sessions.filter((s) => predicate(s)) ?? []
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
  },
  created() {
    guardRoute(this.schedule?.settings.places, this.user, this.$router)
  },
  methods: {
    onFilter(query: any) {
      this.$router.replace({ query })
    },
  },
})
</script>

<style lang="scss">
.placesView {
  .whatsOnView {
    background-color: $background;
  }
}
</style>
