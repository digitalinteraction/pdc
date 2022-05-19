<template>
  <AppLayout
    :app-settings="settings"
    :user="user"
    :routes="routes"
    :nav-links="navLinks"
    class="pdcAppLayout"
  >
    <MainLogo slot="brandA" />

    <!-- <AltLogo slot="brandB" /> -->

    <!-- <LanguageControl slot="languageControl" /> -->

    <router-link slot="brandC" :to="atriumRoute">
      <SquareLogo />
    </router-link>

    <div slot="main" class="pdcAppLayout-main">
      <slot />
      <PageFooter />
    </div>
  </AppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import { PageFlag } from '@openlab/deconf-shared'
import {
  AppLayout,
  AppRoute,
  mapApiState,
  Routes,
} from '@openlab/deconf-ui-toolkit'

import MainLogo from '@/components/MainLogo.vue'
// import AltLogo from '@/components/AltLogo.vue'
import SquareLogo from '@/components/SquareLogo.vue'
import PageFooter from '@/components/PageFooter.vue'

// TODO: temporary
// import AtriumIcon from '@/components/SquareLogo.vue'

// TODO: map actual icons
// import ArtGalleryIcon from '@/icons/ArtGalleryIcon.vue'
// import FringeIcon from '@/icons/FringeIcon.vue'
// import HelpDeskIcon from '@/icons/HelpDeskIcon.vue'
// import HouseIcon from '@/icons/HouseIcon.vue'
// import SkillShareIcon from '@/icons/SkillShareIcon.vue'
import AtriumIcon from '@/icons/AtriumIcon.vue'
// import ScheduleIcon from '@/icons/ScheduleIcon.vue'
// import SpacesIcon from '@/icons/SpacesIcon.vue'
// import EmergentIcon from '@/icons/EmergentIcon.vue'
// import WhatsOnIcon from '@/icons/WhatsOnIcon.vue'
// import MisinfoConIcon from '@/icons/MisinfoConIcon.vue'
import { ExtraRoutes, PdcConferenceConfig } from '@/lib/module'
import { Location } from 'vue-router'

interface RouteIntermediate {
  title: string
  name: string
  icon: Vue.Component
  pageFlag?: PageFlag
}

export default Vue.extend({
  components: {
    AppLayout,
    MainLogo,
    // AltLogo,
    SquareLogo,
    PageFooter,
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user']),
    settings(): PdcConferenceConfig | null {
      return (this.schedule?.settings as any) ?? null
    },
    navLinks(): string[] {
      const links: string[] = []
      if (this.settings?.navigation.showLogin) links.push('login')
      if (this.settings?.navigation.showProfile) links.push('profile')
      if (this.settings?.navigation.showRegister) links.push('register')
      return links
    },
    routes(): AppRoute[] {
      if (!this.settings) return []

      const routes: RouteIntermediate[] = [
        {
          title: this.$t('pdc.pageTitles.atrium') as string,
          name: Routes.Atrium,
          icon: AtriumIcon,
          pageFlag: this.settings.atrium,
        },
        {
          title: this.$t('pdc.pageTitles.schedule') as string,
          name: Routes.Schedule,
          icon: AtriumIcon,
          pageFlag: this.settings.schedule,
        },
        {
          title: this.$t('pdc.pageTitles.keynotes') as string,
          name: ExtraRoutes.Keynotes,
          icon: AtriumIcon,
          pageFlag: this.settings.keynotes,
        },
        {
          title: this.$t('pdc.pageTitles.papers') as string,
          name: ExtraRoutes.Papers,
          icon: AtriumIcon,
          pageFlag: this.settings.papers,
        },
        {
          title: this.$t('pdc.pageTitles.places') as string,
          name: ExtraRoutes.Places,
          icon: AtriumIcon,
          pageFlag: this.settings.places,
        },
        {
          title: this.$t('pdc.pageTitles.newcastle') as string,
          name: ExtraRoutes.Newcastle,
          icon: AtriumIcon,
          pageFlag: this.settings.newcastle,
        },
        {
          title: this.$t('pdc.pageTitles.social') as string,
          name: ExtraRoutes.Social,
          icon: AtriumIcon,
          pageFlag: this.settings.social,
        },
        {
          title: this.$t('pdc.pageTitles.help') as string,
          name: Routes.HelpDesk,
          icon: AtriumIcon,
          pageFlag: this.settings.help,
        },
      ]

      return routes
        .filter((r) => r.pageFlag?.visible)
        .map((r) => ({
          title: r.title,
          name: r.name,
          icon: r.icon,
          enabled: r.pageFlag?.enabled == true,
        }))
    },
    atriumRoute(): Location {
      return { name: Routes.Atrium }
    },
  },
})
</script>

<style lang="scss">
// TODO: migrate to deconf somehow
.pdcAppLayout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;

  > :not(.pageFooter) {
    flex: 1;
  }
}
</style>