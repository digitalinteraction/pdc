<template>
  <AppLayout v-if="paper" class="paperDetailView appLayout-main">
    <SessionLayout>
      <BackButton slot="backButton" :to="papersRoute">
        Back to papers
      </BackButton>

      <div slot="main" class="paperDetailView-main">
        <h1 class="paperDetailView-title">
          {{ paper.title }}
        </h1>
        <div v-if="localeContent" class="content" v-html="localeContent"></div>
        <div class="buttons" v-if="pdfDownload">
          <a
            class="button is-primary"
            :download="pdfDownload.filename"
            :href="pdfDownload.url"
            target="_blank"
            rel="noopener"
          >
            <span class="icon">
              <FontAwesomeIcon :icon="['fas', 'arrow-down']" />
            </span>
            <span>
              {{ $t('pdc.papers.downloadPdf') }}
            </span>
          </a>
        </div>
      </div>

      <div slot="sidebar">
        <SidebarItem v-if="sessionRoute" title="Actions">
          <router-link
            class="button is-primary is-fullwidth is-medium"
            :to="sessionRoute"
          >
            <span>{{ $t('pdc.papers.goToSession') }}</span>
            <BidirectionalIcon
              :ltr="['fas', 'arrow-right']"
              :rtl="['fas', 'arrow-left']"
            />
          </router-link>
        </SidebarItem>

        <SidebarItem title="Authors">
          <ul class="paperDetailView-list">
            <li v-for="author in paper.authors" :key="author">{{ author }}</li>
          </ul>
        </SidebarItem>

        <SidebarItem title="Themes" v-if="themes.length > 0">
          <ul class="paperDetailView-list">
            <li v-for="theme in themes" :key="theme.id">
              {{ theme.title.en }}
            </li>
          </ul>
        </SidebarItem>
      </div>
    </SessionLayout>
  </AppLayout>
  <NotFoundView v-else />
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
  BidirectionalIcon,
} from '@openlab/deconf-ui-toolkit'
import NotFoundView from '@/views/NotFoundView.vue'
import { PaperRecord } from '@/store/papers-module'
import { RawLocation } from 'vue-router'
import { marked } from 'marked'
import { Theme } from '@openlab/deconf-shared/dist/conference'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default Vue.extend({
  components: {
    AppLayout,
    SessionLayout,
    BackButton,
    SidebarItem,
    BidirectionalIcon,
    FontAwesomeIcon,
    NotFoundView,
  },
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
    themes(): Theme[] {
      if (!this.paper || !this.schedule) return []
      const themes = new Map(this.schedule.themes.map((t) => [t.id, t]))
      return this.paper.themes
        .map((id) => themes.get(id) as Theme)
        .filter((t) => t)
    },
    pdfDownload(): { filename: string; url: string } | null {
      const url = this.paper?.files.find((f) => f.endsWith('.pdf'))
      if (!url) return null
      const filename =
        (this.paper?.authors[0]?.replace(/\s+/g, '-').toLowerCase() ??
          'paper') + `.pdf`

      return { filename, url }
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
.paperDetailView-list {
}
.paperDetailView-list li {
  list-style: disc;
  margin-left: 1em;
  font-size: $size-5;
}
</style>
