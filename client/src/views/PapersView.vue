<template>
  <AppLayout>
    <div class="offWhiteBackground">
      <header class="filterHeader">
        <h1 class="filterHeader-title">{{ $t('pdc.papers.title') }}</h1>
        <div class="filterHeader-info">
          <ApiContent slug="papers-filters" />
        </div>
        <!-- TODO: filters here -->
      </header>
      <SessionBoard>
        <article class="paperCell" v-for="paper in papers" :key="paper.id">
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
import { ApiContent, SessionBoard } from '@openlab/deconf-ui-toolkit'
import { mapPapersState } from '@/lib/utils'
import { PaperRecord } from '@/store/papers-module'
import { Location } from 'vue-router'
import { ExtraRoutes } from '@/lib/constants'
import { guardRoute, mapApiState } from '@/lib/module'

export default Vue.extend({
  components: { AppLayout, ApiContent, SessionBoard },
  computed: {
    ...mapApiState('api', ['schedule', 'user']),
    ...mapPapersState('papers', ['papers']),
  },
  created() {
    guardRoute(this.schedule?.settings.papers, this.user, this.$router)
    this.$store.dispatch('papers/fetch')
  },
  methods: {
    paperRoute(paper: PaperRecord): Location {
      return { name: ExtraRoutes.PaperDetail, params: { paperId: paper.id } }
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
