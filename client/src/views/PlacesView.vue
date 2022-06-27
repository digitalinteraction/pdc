<template>
  <AppLayout>
    <div class="offWhiteBackground">
      <header class="filterHeader">
        <h1 class="filterHeader-title">{{ $t('pdc.places.title') }}</h1>
        <div class="filterHeader-info">
          <ApiContent slug="places-filters" />
        </div>
        <!-- <ScheduleFilters
          :schedule="schedule"
          :filters="filters"
          @filter="onFilter"
          :enabled-filters="enabledFilters"
          :language-options="languageOptions"
        /> -->
      </header>
      <SessionBoard>
        <article class="placeCell" v-for="place in places" :key="place.id">
          <p class="placeCell-title">
            <router-link :to="placesRoute(place)">
              {{ place.title }}
            </router-link>
          </p>
        </article>
      </SessionBoard>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import AppLayout from '@/components/PdcAppLayout.vue'
import { mapPlacesState } from '@/lib/utils'
import { ApiContent, SessionBoard } from '@openlab/deconf-ui-toolkit'
import { PlaceRecord } from '@/store/places-module'
import { ExtraRoutes } from '@/lib/constants'
import { RawLocation } from 'vue-router'
import { guardRoute, mapApiState } from '@/lib/module'

export default Vue.extend({
  components: { AppLayout, ApiContent, SessionBoard },
  computed: {
    ...mapApiState('api', ['schedule', 'user']),
    ...mapPlacesState('places', ['places']),
  },
  created() {
    guardRoute(this.schedule?.settings.places, this.user, this.$router)
    this.$store.dispatch('places/fetch')
  },
  methods: {
    placesRoute(place: PlaceRecord): RawLocation {
      const params = { placeId: place.id }
      return { name: ExtraRoutes.PlaceDetail, params }
    },
  },
})
</script>

<style lang="scss">
.placeCell {
}
.placeCell-title {
  font-size: 2rem;
  font-weight: bold;
  font-family: $family-title;
  text-align: center;
}
.placeCell-title a {
  color: $pdc-navy;
  text-decoration: underline;
}
</style>
