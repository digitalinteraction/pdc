<template>
  <ContentLayout slug="help" class="helpView" />
</template>

<script lang="ts">
import Vue from 'vue'
import ContentLayout from '@/components/PdcContentLayout.vue'

export default Vue.extend({
  components: { ContentLayout },
})
</script>

<style lang="scss">
.helpView .contentLayout {
  @include tablet {
    background-image: url(/public/backgrounds/help.webp);
    background-position: top right;
    background-repeat: no-repeat;
    background-size: auto 66.6%;
  }
}
</style>
