<template>
  <ContentLayout class="socialsView">
    <ApiContent slug="social">
      <div slot="social_links" class="buttons">
        <a
          class="button is-facebook is-medium"
          href="https://www.facebook.com/participatorydesignconference"
          target="_blank"
          rel="noopener"
        >
          <span class="icon">
            <FontAwesomeIcon :icon="['fab', 'facebook-f']" size="lg" />
          </span>
          <span>Facebook</span>
        </a>
        <a
          class="button is-twitter is-medium"
          href="https://twitter.com/pdc_conference"
          target="_blank"
          rel="noopener"
        >
          <span class="icon">
            <FontAwesomeIcon :icon="['fab', 'twitter']" size="lg" />
          </span>
          <span>Twitter</span>
        </a>
        <a
          class="button is-instagram is-medium"
          href="https://www.instagram.com/pdc_2022/"
          target="_blank"
          rel="noopener"
        >
          <span class="icon">
            <FontAwesomeIcon :icon="['fab', 'instagram']" size="lg" />
          </span>
          <span>Instagram</span>
        </a>
      </div>
    </ApiContent>
  </ContentLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import ContentLayout from '@/components/PdcContentLayout.vue'
import { ApiContent } from '@openlab/deconf-ui-toolkit'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default Vue.extend({
  components: { ContentLayout, ApiContent, FontAwesomeIcon },
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
