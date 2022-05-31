<template>
  <ContentLayout slug="newcastle" class="newcastleView" />
</template>

<script lang="ts">
import Vue from 'vue'
import ContentLayout from '@/components/PdcContentLayout.vue'

export default Vue.extend({
  components: { ContentLayout },
})
</script>

<style lang="scss">
.newcastleView .contentLayout {
  @include tablet {
    background-image: url(/public/backgrounds/newcastle.png);
    background-position: bottom right;
    background-repeat: no-repeat;
    background-size: contain;
  }
}
</style>
