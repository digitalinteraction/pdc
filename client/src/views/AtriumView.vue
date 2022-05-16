<template>
  <AppLayout class="atriumView">
    <AtriumLayout>
      <!-- TODO: graphic -->
      <HeroCard
        slot="top"
        :title="$t('pdc.atrium.title')"
        :subtitle="$t('pdc.atrium.subtitle')"
        coverImage="/atrium.jpg"
      />

      <BoxContent slot="left" :title="$t('pdc.atrium.heading')">
        <div class="atriumView-content">
          <ApiContent :slug="contentSlug">
            <!-- TODO: custom embeds -->
          </ApiContent>
        </div>
      </BoxContent>

      <div slot="right">
        <ColorWidget
          v-if="!user && widgets.has('register')"
          kind="custom"
          class="is-register"
          :title="$t('pdc.atrium.registerTitle')"
          :subtitle="$t('pdc.atrium.registerSubtitle')"
          :href="$t('pdc.atrium.registerUrl')"
          :icon="['fas', 'ticket-alt']"
        />
        <ColorWidget
          v-if="!user && widgets.has('login')"
          kind="custom"
          class="is-login"
          :title="$t('pdc.atrium.logIn')"
          subtitle=""
          href="/login"
          :icon="['fas', 'envelope']"
        />
        <ColorWidget
          v-if="siteVisitorsIsEnabled && widgets.has('siteVisitors')"
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

        <!-- TODO: custom widgets -->

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
  SessionAndSlot,
  mapApiState,
  mapMetricsState,
  ApiContent,
} from '@openlab/deconf-ui-toolkit'
import { SessionSlot } from '@openlab/deconf-shared'
import AppLayout from '@/components/PdcAppLayout.vue'
import { PdcConferenceConfig } from '@/lib/module'

import sponsorData from '@/data/sponsors.json'

interface Data {
  sponsors: SponsorGroup[]
}

// TODO filter out non art-gallery types, confirm with marc
// const featuredTypeBlocklist = new Set(['art-and-media'])

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
    }
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user']),
    ...mapMetricsState('metrics', ['siteVisitors']),
    settings(): PdcConferenceConfig | null {
      return (this.schedule?.settings as PdcConferenceConfig) ?? null
    },
    siteVisitorsIsEnabled(): boolean {
      if (!this.settings) return false
      return !this.settings.isStatic
    },
    siteVisitorsTitle(): string {
      return this.siteVisitors?.toString() ?? '~'
    },
    contentSlug(): string {
      return this.user ? 'home-personal' : 'home-general'
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

    // TODO: migrate to deconf-ui's getFeaturedSessions
    featuredSessions(): null | SessionAndSlot[] {
      if (!this.schedule) return null
      if (!this.schedule.settings.schedule.enabled) return null

      const now = this.scheduleDate.getTime()
      const inAWeek = now + 7 * 24 * 60 * 60 * 1000
      const slotMap = new Map(this.schedule.slots.map((s) => [s.id, s]))

      return this.schedule.sessions
        .filter((session) => Boolean(session.slot) && session.isFeatured)
        .map((session) => ({
          slot: slotMap.get(session.slot as string) as SessionSlot,
          session: session,
        }))
        .filter(
          (group) =>
            Boolean(group.slot) &&
            group.slot.end.getTime() > now &&
            group.slot.start.getTime() < inAWeek
        )
        .sort((a, b) => a.slot?.start.getTime() - b.slot?.start.getTime())
        .slice(0, 3)
    },
    // TODO: review if this is needed
    // conferenceIsOver(): boolean {
    //   if (!this.settings) return false
    //   return this.scheduleDate.getTime() > this.settings.endDate.getTime()
    // },
    widgets(): Set<string> {
      const widgets = new Set<string>()
      // const conf = this.settings?.atriumWidgets

      // TODO: widget logic
      // if (conf?.siteVisitors) widgets.add('siteVisitors')
      // if (conf?.twitter) widgets.add('twitter')
      // if (conf?.login) widgets.add('login')
      // if (conf?.register) widgets.add('register')
      // if (conf?.spatialChat) widgets.add('spatialChat')
      // if (conf?.slack) widgets.add('slack')
      // if (conf?.familyResources) widgets.add('familyResources')
      // if (conf?.mozfestBook) widgets.add('mozfestBook')

      return widgets
    },
  },
})
</script>

<style lang="scss">
$slack: #b7007e;

.atriumView {
  // TODO: custom widget styles
  .colorWidget.is-slack {
    background-color: $slack;
    &[href]:hover {
      background-color: darken($slack, 7%);
    }
  }
}
</style>
