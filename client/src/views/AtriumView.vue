<template>
  <AppLayout class="atriumView">
    <AtriumLayout>
      <HeroCard
        slot="top"
        :title="$t('pdc.atrium.title')"
        :subtitle="$t('pdc.atrium.subtitle')"
        coverImage="/img/atrium.png"
      />

      <BoxContent slot="left">
        <div class="atriumView-content">
          <ApiContent :slug="contentSlug">
            <div
              slot="visual_schedule"
              class="visualSchedule"
              ref="visualSchedule"
            >
              <img height="420" width="1173" src="/img/schedule.jpg" />
            </div>
          </ApiContent>
        </div>
      </BoxContent>

      <div slot="right">
        <ColorWidget
          v-if="!user && widgets.has('register')"
          kind="custom"
          :title="$t('pdc.atrium.registerTitle')"
          :subtitle="$t('pdc.atrium.registerSubtitle')"
          :href="$t('pdc.atrium.registerUrl')"
          :icon="['fas', 'ticket-alt']"
        />
        <ColorWidget
          v-if="!user && widgets.has('login')"
          kind="custom"
          :title="$t('pdc.atrium.logIn')"
          subtitle=""
          href="/login"
          :icon="['fas', 'envelope']"
        />
        <ColorWidget
          v-if="widgets.has('situatedActions')"
          kind="custom"
          :title="$t('pdc.atrium.situatedActionsTitle')"
          :subtitle="$t('pdc.atrium.situatedActionsSubtitle')"
          :href="$t('pdc.atrium.situatedActionsUrl')"
          :icon="['fas', 'ticket-alt']"
        />
        <ColorWidget
          v-if="widgets.has('a11ySchedule')"
          kind="custom"
          :title="$t('pdc.atrium.a11yScheduleTitle')"
          :subtitle="$t('pdc.atrium.a11yScheduleSubtitle')"
          :href="$t('pdc.atrium.a11yScheduleUrl')"
          :icon="['fas', 'clock']"
        />
        <ColorWidget
          v-if="user && widgets.has('calendarHelp')"
          kind="custom"
          :title="$t('pdc.atrium.calendarHelpTitle')"
          :subtitle="$t('pdc.atrium.calendarHelpSubtitle')"
          :href="$t('pdc.atrium.calendarHelpUrl')"
          :icon="['fas', 'calendar-plus']"
        />
        <ColorWidget
          v-if="widgets.has('siteVisitors')"
          kind="secondary"
          :title="siteVisitorsTitle"
          :subtitle="$t('pdc.atrium.onlineUsers')"
          :icon="['fas', 'users']"
        />
        <ColorWidget
          v-if="widgets.has('twitter')"
          kind="twitter"
          :title="$t('pdc.atrium.twitterTitle')"
          :subtitle="$t('pdc.atrium.twitterSubtitle')"
          :href="$t('pdc.atrium.twitterUrl')"
          :icon="['fab', 'twitter']"
        />

        <FeaturedSessions
          v-if="user && featuredSessions && featuredSessions.length > 0"
          :featured="featuredSessions"
          :current-date="scheduleDate"
        />
      </div>

      <div slot="bottom">
        <SponsorGrid :groups="sponsors" />
      </div>
    </AtriumLayout>
  </AppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Location } from 'vue-router'
import {
  AtriumLayout,
  HeroCard,
  BoxContent,
  ColorWidget,
  SponsorGrid,
  FeaturedSessions,
  SponsorGroup,
  deepSeal,
  Routes,
  mapApiState,
  mapMetricsState,
  ApiContent,
  getFeaturedSessions,
  SessionAndSlot,
} from '@openlab/deconf-ui-toolkit'
import AppLayout from '@/components/PdcAppLayout.vue'
import { PdcConferenceConfig } from '@/lib/module'

import sponsorData from '@/data/sponsors.json'

interface Data {
  sponsors: SponsorGroup[]
  reelObserver?: ResizeObserver
}

export default Vue.extend({
  components: {
    ApiContent,
    AppLayout,
    AtriumLayout,
    HeroCard,
    BoxContent,
    ColorWidget,
    SponsorGrid,
    FeaturedSessions,
  },
  data(): Data {
    return {
      sponsors: deepSeal(sponsorData),
      reelObserver: undefined,
    }
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user']),
    ...mapMetricsState('metrics', ['siteVisitors']),
    settings(): PdcConferenceConfig | null {
      return (this.schedule?.settings as any) ?? null
    },
    siteVisitorsTitle(): string {
      return this.siteVisitors?.toString() ?? '~'
    },
    contentSlug(): string {
      return this.user ? 'home-personal' : 'home-public'
    },
    loginRoute(): Location {
      return { name: Routes.Login }
    },
    registerRoute(): Location {
      return { name: Routes.Register }
    },
    scheduleDate(): Date {
      return this.$dev.scheduleDate ?? this.$temporal.date
    },

    featuredSessions(): null | SessionAndSlot[] {
      return (
        getFeaturedSessions(
          this.schedule,
          7,
          this.scheduleDate,
          (s) => Boolean(s.slot) && s.isFeatured
        )?.slice(0, 3) ?? null
      )
    },
    widgets(): Set<string> {
      return new Set(
        Object.entries(this.settings?.widgets ?? {})
          .filter((entry) => entry[1] === true)
          .map((entry) => entry[0])
      )
    },
  },
  updated() {
    if (
      !this.reelObserver &&
      this.$refs.visualSchedule &&
      'ResizeObserver' in window
    ) {
      this.reelObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle(
            'overflowing',
            entry.target.scrollWidth > entry.target.clientWidth
          )
        }
      })
      this.reelObserver.observe(this.$refs.visualSchedule as HTMLElement)
    }
  },
  destroyed() {
    this.reelObserver?.disconnect()
    this.reelObserver = undefined
  },
  methods: {
    plop(elem: ResizeObserverEntry) {
      console.log(elem)
    },
  },
})
</script>

<style lang="scss">
.atriumView {
  .heroCard {
    background-color: $pdc-sky;
  }
  .heroCard-title,
  .heroCard-subtitle {
    color: $white;
    text-shadow: 2px 3px 3px $black;
  }

  .colorWidget.is-custom {
    color: $black;
    background-color: $pdc-yellow;
    &[href]:hover {
      background-color: darken($pdc-yellow, 7%);
    }
  }
}

// Stolen from https://github.com/digitalinteraction/alembic/blob/main/src/layouts/reel/reel.css
.visualSchedule {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-color: $pdc-navy $pdc-yellow;
  height: auto;
}
.visualSchedule > img {
  block-size: 100%;
  flex-basis: auto;
  inline-size: auto;
  max-width: unset;
  max-height: 360px;
}
.visualSchedule.overflowing {
}
</style>
