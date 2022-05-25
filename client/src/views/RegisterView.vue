<template>
  <UtilLayout>
    <p>Redirecting...</p>
  </UtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import UtilLayout from '@/components/PdcUtilLayout.vue'

export default Vue.extend({
  components: { UtilLayout },
  created() {
    window.open(this.$t('pdc.atrium.registerUrl') as string)
    this.$router.back()
  },
})
</script>
