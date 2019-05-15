<template>
  <div class="tour-details">
   <h3 class="tour-title" :data-title-short="this.tour.titleShort" v-html="this.tour.name" />
    <p class="desc" v-html="this.tour.listingText" />
    <div v-if="this.similarView !== true" class="tour-box-reviews">
      <svgicon
        v-for="index in 5"
        v-bind:key="index"
        :class="getStarClass(index)"
        name="star"
        width="20"
        height="20"
      />
      <p class="count">{{ this.tour.review_status.data.feedback_count !== undefined ? this.tour.review_status.data.feedback_count : 0}} reviews</p>
    </div>
    <div class="tour-stats">
      <p><svgicon name="clock" class="icon icon-clock" width="23" height="23" /> {{ this.tour.duration }}</p>
      <div class="sep"></div>
      <p><svgicon name="max" class="icon icon-max" width="23" height="23" /> Max {{ this.tour.groupSize }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TourDetail',
  props: {
    tour: {
      type: Object,
      required: true
    },
    similarView: Boolean
  },
  methods: {
    getStarClass (index) {
      let score = 0
      if (this.tour.reviewsAverage !== undefined) {
        score = this.tour.reviewsAverage
      } else {
        score = this.tour.review_status.data.feedback_average
      }
      if (index === 5 && score >= 4.7) {
        return 'icon icon-star_active'
      } else if (index < 5 && score >= index) {
        return 'icon icon-star_active'
      } else {
        return 'icon icon-star'
      }
    }
  }
}
</script>

