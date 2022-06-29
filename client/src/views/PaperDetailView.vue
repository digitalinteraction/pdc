<template>
  <AppLayout v-if="paper" class="paperDetailView">
    <SessionLayout>
      <BackButton slot="backButton" :to="papersRoute">
        Back to papers
      </BackButton>

      <div slot="main" class="paperDetailView-main">
        <h1 class="paperDetailView-title">
          {{ paper.title }}
        </h1>
        <div v-if="localeContent" class="content" v-html="localeContent"></div>
      </div>

      <div slot="sidebar">
        <SidebarItem v-if="sessionRoute" title="Actions">
          <router-link
            class="button is-primary is-fullwidth is-medium"
            :to="sessionRoute"
          >
            <span>Go to session</span>
            <span class="icon">
              <fa-icon :icon="['fas', 'arrow-right']" />
            </span>
          </router-link>
        </SidebarItem>

        <SidebarItem title="Authors">
          <ul class="paperDetailView-authors">
            <li v-for="author in paper.authors" :key="author">{{ author }}</li>
          </ul>
        </SidebarItem>
      </div>
    </SessionLayout>
  </AppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import AppLayout from '@/components/PdcAppLayout.vue'
import {
  ExtraRoutes,
  guardRoute,
  mapApiState,
  mapPapersState,
} from '@/lib/module'
import {
  BackButton,
  Routes,
  SessionLayout,
  SidebarItem,
} from '@openlab/deconf-ui-toolkit'
import { PaperRecord } from '@/store/papers-module'
import { RawLocation } from 'vue-router'
import { marked } from 'marked'

export default Vue.extend({
  components: { AppLayout, SessionLayout, BackButton, SidebarItem },
  props: {
    paperId: { type: String, required: true },
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user']),
    ...mapPapersState('papers', ['papers']),
    paper(): PaperRecord | null {
      return this.papers?.find((p) => p.id === this.paperId) ?? null
    },
    papersRoute(): RawLocation {
      return { name: ExtraRoutes.Papers }
    },
    sessionRoute(): RawLocation | null {
      if (!this.paper?.sessionId) return null
      return {
        name: Routes.Session,
        params: { sessionId: this.paper.sessionId },
      }
    },
    localeContent(): string | null {
      if (!this.paper) return null
      return marked(this.paper.content)
    },
  },
  created() {
    guardRoute(this.schedule?.settings.papers, this.user, this.$router)
    this.$store.dispatch('papers/fetch')
  },
})
</script>

<style lang="scss">
.paperDetailView {
}
.paperDetailView-main > * + * {
  margin-block-start: $block-spacing;
}
.paperDetailView-main {
}
.paperDetailView-sidebar {
}
.paperDetailView-title {
  font-size: $size-2;
  font-weight: bold;
  font-family: $family-title;
  line-height: 1;
}
.paperDetailView-authors {
}
.paperDetailView-authors li {
  list-style: disc;
  margin-left: 1em;
  font-size: $size-5;
}
</style>
