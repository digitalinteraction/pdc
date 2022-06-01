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
    }
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user']),
    ...mapMetricsState('metrics', ['siteVisitors']),
    settings(): PdcConferenceConfig | null {
      return (this.schedule?.settings as any) ?? null
    },
    siteVisitorsIsEnabled(): boolean {
      if (!this.settings) return false
      return !this.settings.widgets.siteVisitors
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
      const widgets = new Set<string>()
      const conf = this.settings?.widgets

      if (conf?.siteVisitors) widgets.add('siteVisitors')
      if (conf?.twitter) widgets.add('twitter')
      if (conf?.login) widgets.add('login')
      if (conf?.register) widgets.add('register')

      return widgets
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

  .colorWidget.is-login,
  .colorWidget.is-register {
    color: $black;
    background-color: $pdc-yellow;
    &[href]:hover {
      background-color: darken($pdc-yellow, 7%);
    }
  }
}
</style>
