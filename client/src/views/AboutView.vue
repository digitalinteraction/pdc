<template>
  <ContentLayout slug="about" class="aboutView" />
</template>

<script lang="ts">
import Vue from 'vue'
import ContentLayout from '@/components/PdcContentLayout.vue'

export default Vue.extend({
  components: { ContentLayout },
})
</script>

<style lang="scss">
.aboutView .contentLayout {
  @include tablet {
    background-image: url(/public/backgrounds/about.webp);
    background-position: calc(100% - 50px) center;
    background-repeat: repeat-y;
    background-size: 150px auto;
  }
}
</style>
