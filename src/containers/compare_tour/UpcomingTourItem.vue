<template>
  <div class="upcoming-tour-row">
    <div class="upcoming-tour-price" v-html="getPrice (tour.price[this.currency].toFixed())"></div>
    <div class="tour-name">{{ tour.name }}</div>
    <div class="upcoming-tour-time">{{ tour.time }}</div>
    <div>{{ tour.duration }}</div>
    <div class="view-tour">
      <router-link :to="getToUrl(tour.url)" class="btn secondary grey green-hover">
        View Tour
      </router-link>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'UpcomingTourItem',
  props: {
    tour: {
      time: String,
      name: String,
      price: String,
      duration: String,
      url: String
    }
  },
  computed: {
    ...mapGetters([
      'currency'
    ])
  },
  methods: {
    getPrice (price) {
      if (price === 0) {
        return ''
      }

      switch (this.currency) {
        case 'USD':
          return '$' + price
        case 'EUR':
          return '€' + price
        case 'GBP':
          return '£' + price
        case 'CAD':
          return '$' + price
        case 'AUD':
          return '$' + price
      }
      return price
    },
    getToUrl (url) {
      let trailingSlash = ''
      if (!url.match(/\/$/)) {
        trailingSlash = '/'
      }
      return url + trailingSlash
    }
  }
}
</script>
