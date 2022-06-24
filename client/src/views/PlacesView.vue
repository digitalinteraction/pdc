<template>
  <AppLayout>
    <div class="placesView">
      <header class="placesView-header">
        <h1 class="whatsOnView-title">{{ $t('pdc.places.title') }}</h1>
        <div class="placesView-info">
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

export default Vue.extend({
  components: { AppLayout, ApiContent, SessionBoard },
  computed: {
    ...mapPlacesState('places', ['places']),
  },
  mounted() {
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
.placesView {
  background-color: $background;
}
.placesView-header {
  padding: $block-spacing;
  background-color: $white;
  border-bottom: 1px solid $border;
  flex: 0;
}
.placesView-header > * + * {
  margin-block-start: 0.5rem;
}
.placesView-title {
  font-size: $size-3;
  font-weight: bold;
  font-family: $family-title;
}
.placesView-info {
}

// ...

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
