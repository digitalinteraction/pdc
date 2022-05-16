<template>
  <UtilLayout>
    <div class="content">
      <template v-if="errorCode === 'login_expired'">
        <h1>{{ $t('pdc.serverError.loginExpired.title') }}</h1>
        <p>{{ $t('pdc.serverError.loginExpired.info') }}</p>
        <p>
          <router-link :to="loginRoute" class="button is-link">
            {{ $t('pdc.serverError.loginExpired.action') }}
          </router-link>
        </p>
      </template>
      <template v-else>
        <h1>{{ $t('pdc.serverError.unknown.title') }}</h1>
        <p>{{ $t('pdc.serverError.unknown.info') }}</p>
        <p>
          <a :href="`mailto:${$t('pdc.serverError.unknown.email')}`">
            {{ $t('pdc.serverError.unknown.email') }}
          </a>
        </p>
      </template>
    </div>
  </UtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import UtilLayout from '@/components/PdcUtilLayout.vue'
import { Routes } from '@openlab/deconf-ui-toolkit'

// TODO: migrate to @openlab/deconf-ui ?

export default Vue.extend({
  components: { UtilLayout },
  props: {
    errorCode: { type: String, default: 'unknown' },
  },
  computed: {
    loginRoute(): unknown {
      return { name: Routes.Login }
    },
  },
})
</script>
