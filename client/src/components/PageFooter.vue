<template>
  <PageFooter :links="links">
    <template slot="beforeLinks">
      <span class="pageFooter-acknowledgement">
        We Acknowledge the Traditional Custodians of the lands, skies and waters
        and give respect to all First Nations members. We also give thanks to
        the deep wisdoms of Indigenous Elders before, now and into the future,
        and honour their strength, resilience and creativity.
      </span>
    </template>
    Made by
    <a href="https://openlab.ncl.ac.uk/" target="_blank" rel="noopener">
      Open Lab
    </a>
    /
    {{ appName }}
    {{ appVersion }}
  </PageFooter>
</template>

<script lang="ts">
import { PageFooter, PageFooterLink, Routes } from '@openlab/deconf-ui-toolkit'
import Vue from 'vue'

interface Data {
  appName: string
  appVersion: string
}

export default Vue.extend({
  components: { PageFooter },
  data(): Data {
    return {
      appName:
        (this.$t('pdc.footer.appName') as string) || process.env.VUE_APP_NAME,
      appVersion:
        (this.$env.BUILD_NAME as string) || `v${process.env.VUE_APP_VERSION}`,
    }
  },
  computed: {
    links(): PageFooterLink[] {
      return [
        {
          title: this.$t('pdc.footer.privacy'),
          url: this.$router.resolve({ name: Routes.Privacy })?.href as string,
        },
        {
          title: this.$t('pdc.footer.terms'),
          url: this.$router.resolve({ name: Routes.Terms })?.href as string,
        },
        {
          title: this.$t('pdc.footer.guidelines'),
          url: this.$t('pdc.footer.guidelinesUrl'),
        },
      ]
    },
  },
})
</script>

<style lang="scss">
.pageFooter-acknowledgement {
  max-width: $tablet;
  margin-inline: auto;
  display: inline-block;
  text-align: justify;
  margin-block-end: 16px;
  font-weight: $weight-bold;
}
</style>
