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
    background-image: url(/public/backgrounds/about.png);
    background-position: right center;
    background-repeat: no-repeat;
    background-size: auto 100%;
  }
}
</style>
