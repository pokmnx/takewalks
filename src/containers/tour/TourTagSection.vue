<template>
  <div
    :class="getClass()"
    :id="getID()"
  >
    <div class="container">
      <TourSectionTitle :tag="this.tag" />
      <div class="tour-list-items vertical">
        <TourContainer
          v-for="tour in this.tag.tours"
          v-bind:key="tour.name"
          :tour="tour"
        />
      </div>
      <CompareTours v-if="this.tag.slug" :slug="getCompareTag()" />
    </div>
  </div>
</template>

<script>

import TourSectionTitle from '@/components/TourSectionTitle'
import TourContainer from '@/containers/tour/TourContainer'
import CompareTours from '@/components/CompareTours'

export default {
  name: 'TourTagSection',
  components: {
    TourSectionTitle,
    TourContainer,
    CompareTours
  },
  props: {
    tag: {
      type: Object,
      required: true
    }
  },
  methods: {
    getClass () {
      return this.tag.slug ? 'tour-list-section' : 'tour-list-section no-link'
    },
    getID () {
      let preStr = this.tag.name.replace(/[^\w\s]/gi, '').toLowerCase()
      return 'tag-' + preStr.replace(new RegExp(' ', 'g'), '-').toLowerCase()
    },
    getCompareTag () {
      return '/' + this.tag.tours[0].citySlug + '/' + this.tag.slug + '/'
    }
  }
}
</script>

