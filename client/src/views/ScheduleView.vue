<template>
  <AppLayout>
    <FilteredScheduleView
      v-if="schedule"
      :schedule="schedule"
      :user-sessions="userSessions"
      :options="options"
      :schedule-date="scheduleDate"
      :route-query="$route.query"
      @filter="onFilter"
    >
      <span slot="title">{{ $t('pdc.pageTitles.schedule') }}</span>
      <ApiContent slot="infoText" slug="programme-filters" />
      <span slot="noResults">{{ $t('pdc.general.noResults') }}</span>
    </FilteredScheduleView>
  </AppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import AppLayout from '@/components/PdcAppLayout.vue'
import {
  ApiContent,
  FilteredScheduleOptions,
  FilteredScheduleView,
} from '@openlab/deconf-ui-toolkit'
import { getLanguageOptions, guardRoute, mapApiState } from '@/lib/module'

const trackBlockList = new Set<string>([
  // 'fb858d34-9492-4596-b5e9-20b9a6e035f2', // PDC Places
])

const options: FilteredScheduleOptions = {
  predicate(session) {
    return !trackBlockList.has(session.track)
  },
  filtersKey: 'pdcProgrammeViewFilters',
  scheduleConfig: {
    tileHeader: ['type'],
    tileAttributes: ['track', 'themes'],
  },
  enabledFilters: ['query', 'sessionType', 'track', 'theme', 'date'],
  languages: getLanguageOptions(),
}

interface Data {
  options: FilteredScheduleOptions
}

export default Vue.extend({
  components: { AppLayout, FilteredScheduleView, ApiContent },
  data: (): Data => ({ options }),
  computed: {
    ...mapApiState('api', ['schedule', 'user', 'userSessions']),
    scheduleDate() {
      return this.$dev?.scheduleDate ?? this.$temporal.date
    },
  },
  created() {
    guardRoute(this.schedule?.settings.schedule, this.user, this.$router)
  },
  methods: {
    onFilter(query: any) {
      this.$router.replace({ query })
    },
  },
})
</script>
