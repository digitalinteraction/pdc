<template>
  <UtilLayout>
    <div class="content">
      <h1>{{ $t('pdc.notFound.title') }}</h1>
      <p>{{ $t('pdc.notFound.info') }}</p>
    </div>
  </UtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import UtilLayout from '@/components/PdcUtilLayout.vue'

export default Vue.extend({
  components: { UtilLayout },
})
</script>
