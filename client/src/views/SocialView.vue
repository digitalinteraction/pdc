<template>
  <ContentLayout slug="social" class="socialsView" />
</template>

<script lang="ts">
import Vue from 'vue'
import ContentLayout from '@/components/PdcContentLayout.vue'

export default Vue.extend({
  components: { ContentLayout },
})
</script>

<style lang="scss">
.socialsView .contentLayout {
  @include tablet {
    background-image: url(/public/backgrounds/socials.webp);
    background-position: 100% 100px;
    background-repeat: repeat-y;
    background-size: 200px auto;
  }
}
</style>
