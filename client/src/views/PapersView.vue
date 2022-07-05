<template>
  <AppLayout>
    <div class="offWhiteBackground">
      <header class="filterHeader">
        <h1 class="filterHeader-title">{{ $t('pdc.papers.title') }}</h1>
        <div class="filterHeader-info">
          <ApiContent slug="papers-filters" />
        </div>
        <ScheduleFilters
          :schedule="schedule"
          :filters="filters"
          :enabled-filters="['query', 'theme']"
          :language-options="[]"
          @filter="onFilter"
        />
      </header>
      <SessionBoard>
        <article
          class="paperCell"
          v-for="paper in filteredPapers"
          :key="paper.id"
        >
          <p class="paperCell-title">
            <router-link :to="paperRoute(paper)">
              {{ paper.title }}
            </router-link>
          </p>
          <p class="paperCell-body">
            {{ paper.authors.join(', ') }}
          </p>
        </article>
      </SessionBoard>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import AppLayout from '@/components/PdcAppLayout.vue'
import {
  ApiContent,
  encodeScheduleFilters,
  loadScheduleFilters,
  ScheduleFilterRecord,
  ScheduleFilters,
  SessionBoard,
} from '@openlab/deconf-ui-toolkit'
import { mapPapersState } from '@/lib/utils'
import { PaperRecord } from '@/store/papers-module'
import { Location } from 'vue-router'
import { ExtraRoutes } from '@/lib/constants'
import { guardRoute, mapApiState } from '@/lib/module'

const FILTERS_KEY = 'pdcPapersViewFilters'

interface Data {
  filters: ScheduleFilterRecord
}

export default Vue.extend({
  components: { AppLayout, ApiContent, SessionBoard, ScheduleFilters },
  data(): Data {
    return {
      filters: loadScheduleFilters(FILTERS_KEY),
    }
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user']),
    ...mapPapersState('papers', ['papers']),
    filteredPapers(): PaperRecord[] | undefined {
      const predicate = this.getPredicate(this.filters)
      return this.papers?.filter((p) => predicate(p))
    },
  },
  created() {
    guardRoute(this.schedule?.settings.papers, this.user, this.$router)
    this.$store.dispatch('papers/fetch')
  },
  methods: {
    paperRoute(paper: PaperRecord): Location {
      return { name: ExtraRoutes.PaperDetail, params: { paperId: paper.id } }
    },
    onFilter(filters: ScheduleFilterRecord) {
      this.filters = filters

      window.setTimeout(() => {
        const encoded = encodeScheduleFilters(filters)
        localStorage.setItem(FILTERS_KEY, JSON.stringify(encoded))
      })
    },
    getPredicate(filter: ScheduleFilterRecord) {
      const trim = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')

      const query = trim(filter.query)
      const isMatch = (s: string) => trim(s).includes(query)

      if (!query && !filter.theme) return () => true

      return (p: PaperRecord): boolean => {
        if (query) {
          // Check the title for matches
          if (isMatch(p.title)) return true

          // Check the keywords for matches
          if (p.keywords.some((k) => isMatch(k))) return true

          // Check the authors for matches
          if (p.authors.some((k) => isMatch(k))) return true
        }

        // Check if the themes match
        if (filter.theme && p.themes.includes(filter.theme)) return true

        return false
      }
    },
  },
})
</script>

<style lang="scss">
.paperCell {
}
.paperCell > * + * {
  margin-block-start: 0.5rem;
}
.paperCell-title {
  font-size: 2rem;
  font-weight: bold;
  font-family: $family-title;
  line-height: 1.2;
}
.paperCell-title a {
  color: $pdc-navy;
  text-decoration: none;
}
.paperCell-title a:hover {
  text-decoration: underline;
}
</style>
