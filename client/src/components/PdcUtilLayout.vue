<template>
  <UtilLayout :home-route="atriumRoute" :width="width">
    <MainLogo slot="brand" />

    <template slot="backButton">
      <slot name="backButton">
        <BackButton :to="atriumRoute">
          {{ $t('pdc.general.backToAtrium') }}
        </BackButton>
      </slot>
    </template>

    <!-- <LanguageControl slot="languageControl" /> -->

    <slot slot="main" />

    <PageFooter slot="footer" />
  </UtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Location } from 'vue-router'

import MainLogo from './MainLogo.vue'
import PageFooter from './PageFooter.vue'
import { BackButton, Routes, UtilLayout } from '@openlab/deconf-ui-toolkit'

export default Vue.extend({
  components: { UtilLayout, MainLogo, PageFooter, BackButton },
  props: {
    width: { type: String, default: 'regular' },
  },
  computed: {
    atriumRoute(): Location {
      return { name: Routes.Atrium }
    },
  },
})
</script>
