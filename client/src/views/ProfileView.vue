<template>
  <UtilLayout>
    <ProfileView
      v-if="user && profile"
      api-module="api"
      :fields="fields"
      @logout="onLogout"
      @unregister="onUnregister"
    >
      <!-- AddUserCalendar? -->
      <div slot="preActions" />
    </ProfileView>
  </UtilLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  FullAuthToken,
  mapApiState,
  ProfileField,
  ProfileView,
} from '@openlab/deconf-ui-toolkit'

import UtilLayout from '@/components/PdcUtilLayout.vue'
import { StorageKey } from '@/lib/module'
import languageData from '@/data/languages.json'

export default Vue.extend({
  components: { UtilLayout, ProfileView },
  computed: {
    ...mapApiState('api', ['user', 'profile']),
    fields(): ProfileField[] {
      if (!this.profile || !this.user) return []
      return [
        {
          label: this.$t('deconf.profile.pdc.nameText'),
          value: this.profile.name,
        },
        {
          label: this.$t('deconf.profile.pdc.emailText'),
          value: this.profile.email,
        },
        {
          label: this.$t('deconf.profile.pdc.localeText'),
          value: languageData[this.user.user_lang],
        },
        {
          label: this.$t('deconf.profile.pdc.registeredText'),
          value: this.profile.created.toLocaleString(),
        },
        {
          label: this.$t('deconf.profile.pdc.whenText'),
          value: this.iatToString((this.user as FullAuthToken).iat),
        },
      ]
    },
  },
  mounted() {
    this.fetchProfile()
  },
  methods: {
    async fetchProfile() {
      await this.$store.dispatch('api/fetchProfile')
      if (!this.profile) this.onLogout()
    },
    onLogout() {
      localStorage.removeItem(StorageKey.AuthToken)
      setTimeout(() => window.location.reload(), 500)
    },
    onUnregister() {
      // ...
    },
    iatToString(iat: number) {
      const date = new Date(iat * 1000)
      date.setMinutes(
        date.getMinutes() + date.getTimezoneOffset(),
        date.getSeconds(),
        date.getMilliseconds()
      )

      return date.toLocaleString()
    },
  },
})
</script>

<style lang="scss">
// TODO: Hacky - hide the remove profile button
.profileView > :nth-child(6),
.profileView > :nth-child(7) {
  display: none;
}
</style>
