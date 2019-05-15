<template>
  <div class="compare-tours-header">
    <div class="container">
      <div class="compare-row">
        <div class="compare-row-title big">Tour</div>
        <div
          class="compare-row-item image"
          v-for="(tour, index) in this.tours"
          v-bind:key="index"
        >
          <img :src="getTourImageSrc(tour)" alt="">
          <h3 class="tour-title" v-html="tour.name"></h3>
          <div>
            <router-link :to="getReference(tour)" class="btn secondary purple lcased">
              Read More
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompareTourHeader',
  props: {
    tours: {
      type: Array,
      required: true
    }
  },
  methods: {
    getTourImageSrc (tour) {
      return tour.featuredImage + '?w=500'
    },
    getReference (tour) {
      return '/' + tour.citySlug + '/' + tour.slug
    }
  }
}
</script>
