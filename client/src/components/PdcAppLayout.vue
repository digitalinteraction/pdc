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
import AtriumIcon from '@/components/SquareLogo.vue'

// TODO: map actual icons
// import ArtGalleryIcon from '@/icons/ArtGalleryIcon.vue'
// import FringeIcon from '@/icons/FringeIcon.vue'
// import HelpDeskIcon from '@/icons/HelpDeskIcon.vue'
// import HouseIcon from '@/icons/HouseIcon.vue'
// import SkillShareIcon from '@/icons/SkillShareIcon.vue'
// import AtriumIcon from '@/icons/AtriumIcon.vue'
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
          title: this.$t('pdc.appLayout.atrium') as string,
          name: Routes.Atrium,
          icon: AtriumIcon,
          pageFlag: this.settings.home,
        },
        // {
        //   title: this.$t('pdc.appLayout.whatsOn') as string,
        //   name: Routes.WhatsOn,
        //   icon: WhatsOnIcon,
        //   pageFlag: this.settings.whatsOn,
        // },
        // {
        //   title: this.$t('pdc.appLayout.schedule') as string,
        //   name: Routes.Schedule,
        //   icon: ScheduleIcon,
        //   pageFlag: this.settings.schedule,
        // },
        // {
        //   title: this.$t('pdc.appLayout.arts') as string,
        //   name: ExtraRoutes.Arts,
        //   icon: ArtGalleryIcon,
        //   pageFlag: this.settings.arts,
        // },
        // {
        //   title: this.$t('pdc.appLayout.skillShare') as string,
        //   name: ExtraRoutes.SkillShare,
        //   icon: SkillShareIcon,
        //   pageFlag: this.settings.skillShare,
        // },
        // {
        //   title: this.$t('pdc.appLayout.fringe') as string,
        //   name: ExtraRoutes.Fringe,
        //   icon: FringeIcon,
        //   pageFlag: this.settings.fringe,
        // },
        // {
        //   title: this.$t('pdc.appLayout.house') as string,
        //   name: ExtraRoutes.House,
        //   icon: HouseIcon,
        //   pageFlag: this.settings.house,
        // },
        // {
        //   title: this.$t('pdc.appLayout.misinfoCon') as string,
        //   name: ExtraRoutes.MisinfoCon,
        //   icon: MisinfoConIcon,
        //   pageFlag: this.settings.misinfoCon,
        // },
        // {
        //   title: this.$t('pdc.appLayout.social') as string,
        //   name: ExtraRoutes.Spaces,
        //   icon: SpacesIcon,
        //   pageFlag: this.settings.social,
        // },
        // {
        //   title: this.$t('pdc.appLayout.emergentSessions') as string,
        //   name: ExtraRoutes.EmergentInfo,
        //   icon: EmergentIcon,
        //   pageFlag: this.settings.emergentInfo,
        // },
        // {
        //   title: this.$t('pdc.appLayout.emergentSessions') as string,
        //   name: ExtraRoutes.EmergentSessions,
        //   icon: EmergentIcon,
        //   pageFlag: this.settings.emergentSessions,
        // },
        // {
        //   title: this.$t('pdc.appLayout.helpDesk') as string,
        //   name: Routes.HelpDesk,
        //   icon: HelpDeskIcon,
        //   pageFlag: this.settings.helpDesk,
        // },
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
