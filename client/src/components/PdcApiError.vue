<template>
  <ApiError :home-route="homeRoute">
    <!-- <PdcLogo slot="brand" /> -->
    <!-- <PdcPageFooter slot="footer" /> -->
  </ApiError>
</template>

<script lang="ts">
import Vue from 'vue'
import { ApiError } from '@openlab/deconf-ui-toolkit'

// import PdcLogo from './PdcLogo.vue'
// import PdcPageFooter from './PdcPageFooter.vue'

// TODO: add logos

export default Vue.extend({
  components: { ApiError },
  props: {
    homeRoute: { type: Object, required: true },
  },
})
</script>
