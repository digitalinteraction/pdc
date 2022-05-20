<template>
  <AppLayout>
    <FilteredScheduleView
      v-if="schedule"
      :schedule="schedule"
      :user-sessions="userSessions"
      :options="options"
      :schedule-date="scheduleDate"
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

const options: FilteredScheduleOptions = {
  predicate(session) {
    return true
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
