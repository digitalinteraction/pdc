<template>
  <div class="speakerDialog">
    <div class="speakerDialog-header">
      <img class="speakerDialog-headshot" :src="speaker.headshot" />
      <div>
        <h1 class="speakerDialog-name">{{ speaker.name }}</h1>
        <p class="speakerDialog-role">{{ localeRole }}</p>
      </div>
    </div>
    <p class="speakerDialog-bio" v-html="localeContent" />
    <div class="buttons">
      <button class="button is-link" @click="onClose">
        {{ $t('deconf.general.closeDialog') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { marked } from 'marked'
import { Speaker } from '@openlab/deconf-shared'
import { localiseFromObject } from '@openlab/deconf-ui-toolkit'

import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    speaker: { type: Object as PropType<Speaker>, required: true },
  },
  computed: {
    localeRole(): string | null {
      return localiseFromObject(this.$i18n.locale, this.speaker.role)
    },
    localeContent(): string | null {
      const content = localiseFromObject(this.$i18n.locale, this.speaker.bio)
      return content ? marked(content) : null
    },
  },
  methods: {
    onClose() {
      this.$deconf.closeDialog()
    },
  },
})
</script>

<style lang="scss">
.speakerDialog-headshot {
  aspect-ratio: 1 / 1;
  object-fit: cover;
}
</style>
