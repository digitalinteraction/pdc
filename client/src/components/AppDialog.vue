<template>
  <FullScreenDialog v-if="dialogPlugin.component" @close="dialogPlugin.close()">
    <component :is="dialogPlugin.component" v-bind="dialogPlugin.props" />
  </FullScreenDialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { FullScreenDialog } from '@openlab/deconf-ui-toolkit'

import { DialogPlugin } from '@/plugins/dialog-plugin'

// TODO: isn't this in the library now?

export default Vue.extend({
  components: { FullScreenDialog },
  props: {
    dialogPlugin: { type: Object as PropType<DialogPlugin>, required: true },
  },
})
</script>
