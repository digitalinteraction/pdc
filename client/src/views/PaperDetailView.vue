<template>
  <AppLayout>
    <p>Paper Detail View {{ paperId }}</p>
  </AppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import AppLayout from '@/components/PdcAppLayout.vue'

export default Vue.extend({
  components: { AppLayout },
  props: {
    paperId: { type: String, required: true },
  },
  created() {
    this.$store.dispatch('papers/fetch')
  },
})
</script>
