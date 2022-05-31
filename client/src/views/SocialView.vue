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
    background-image: url(/public/backgrounds/socials.png);
    background-position: bottom right;
    background-repeat: no-repeat;
    background-size: auto 100%;
  }
}
</style>
