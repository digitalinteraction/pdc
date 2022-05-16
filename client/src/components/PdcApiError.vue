<template>
  <ApiError :home-route="homeRoute">
    <MainLogo slot="brand" />
    <PageFooter slot="footer" />
  </ApiError>
</template>

<script lang="ts">
import Vue from 'vue'
import { ApiError } from '@openlab/deconf-ui-toolkit'

import MainLogo from './MainLogo.vue'
import PageFooter from './PageFooter.vue'

export default Vue.extend({
  components: { ApiError, MainLogo, PageFooter },
  props: {
    homeRoute: { type: Object, required: true },
  },
})
</script>
