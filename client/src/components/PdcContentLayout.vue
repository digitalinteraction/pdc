<template>
  <AppLayout>
    <div class="contentLayout">
      <section class="section">
        <div class="container">
          <BoxContent>
            <slot name="content">
              <ApiContent :slug="slug" />
            </slot>
          </BoxContent>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import AppLayout from './PdcAppLayout.vue'
import { ApiContent, BoxContent } from '@openlab/deconf-ui-toolkit'
import { guardRoute, mapApiState } from '@/lib/module'
import { PageFlag } from '@openlab/deconf-shared/dist/conference'

export default Vue.extend({
  props: {
    slug: { type: String, required: true },
    flag: { type: Object as PropType<PageFlag | null>, default: null },
  },
  components: { AppLayout, ApiContent, BoxContent },
  computed: {
    ...mapApiState('api', ['user']),
  },
  created() {
    if (this.flag) guardRoute(this.flag, this.user, this.$router)
  },
})
</script>

<style lang="scss">
.contentLayout {
  background: $background;
}
</style>
