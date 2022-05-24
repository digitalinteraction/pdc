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
      <span slot="title">{{ $t('pdc.pageTitles.keynotes') }}</span>
      <ApiContent slot="infoText" slug="keynotes-filters" />
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
    // Keynote type
    return session.type === '29fe71f3-586d-4647-b8e6-53bdc8963c9c'
  },
  filtersKey: 'pdcKeynotesViewFilters',
  scheduleConfig: {
    tileHeader: ['themes'],
    tileAttributes: ['languages', 'recorded'],
  },
  enabledFilters: ['query', 'theme', 'date'],
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
    guardRoute(this.schedule?.settings.keynotes, this.user, this.$router)
  },
  methods: {
    onFilter(query: any) {
      this.$router.replace({ query })
    },
  },
})
</script>
