<template>
  <AppLayout>
    <p>Paper Detail View {{ paperId }}</p>
  </AppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import AppLayout from '@/components/PdcAppLayout.vue'
import { guardRoute, mapApiState } from '@/lib/module'

export default Vue.extend({
  components: { AppLayout },
  props: {
    paperId: { type: String, required: true },
  },
  computed: {
    ...mapApiState('api', ['schedule', 'user']),
  },
  created() {
    guardRoute(this.schedule?.settings.papers, this.user, this.$router)
    this.$store.dispatch('papers/fetch')
  },
})
</script>
