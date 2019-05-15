<template>
  <LazyBackground
    class="tour-img"
    :imageSource="getImage(false)"
    :loadingImage="getImage(true)"
  >
    <div v-if="this.tour.medal" :class="getBadgeClass()" tooltip-trigger>
      <div tooltip-content class="tour-box-tooltip">
        <h5 class="tooltip-title">{{ this.tour.medal }} Badge</h5>
        <p class="default">{{ medals[this.tour.medal] }}</p>
      </div>
    </div>
    <div v-if="this.tour.price" class="tour-price">
      <span v-if="!Array.isArray(this.tour.priceDiscount.data)  && this.checkPromo()" class="default-price strike-through">{{ this.getPrice() }}</span>
      <span v-if="!Array.isArray(this.tour.priceDiscount.data)  && this.checkPromo()" class="discounted-price">{{ this.getDiscountPrice() }}</span>
      <span v-else class="default-price">{{ this.getPrice() }}</span>
    </div>

    <div v-if="this.tour.flag === 'Likely To Sell Out'" class="tour-tag sale">
      <div class="icon-holder"><svgicon name="sell_out" class="icon icon-sell_out" /></div>
      <div class="text-holder">{{ this.tour.flag }}</div>
    </div>
    <div v-if="this.tour.flag === 'New'" class="tour-tag new">
      <div class="icon-holder"><svgicon name="new" class="icon icon-new" /></div>
      <div class="text-holder">{{ this.tour.flag }}</div>
    </div>
    <div v-if="this.tour.flag === 'Exclusive'" class="tour-tag exclusive">
      <div class="icon-holder"><svgicon name="exclusive" class="icon icon-exclusive" /></div>
      <div class="text-holder">{{ this.tour.flag }}</div>
    </div>
  </LazyBackground>
</template>

<script>

import { mapGetters } from 'vuex'
import LazyBackground from '@/components/LazyBackground'

export default {
  name: 'TourAvatar',
  props: {
    tour: {
      type: Object,
      required: true
    }
  },
  components: {
    LazyBackground
  },
  computed: {
    ...mapGetters([
      'currency'
    ])
  },
  methods: {
    checkPromo () {
      if (process.env.PROMOCODE !== undefined) {
        return true
      } else {
        return false
      }
    },
    getBadgeClass () {
      return 'tour-badge ' + this.tour.medal.toLowerCase()
    },
    getPrice () {
      // return this.tour.price['adults_price'][this.currency]['exchangeAmount']
      switch (this.$store.state.Common.currency) {
        case 'USD':
          return '$' + Number(this.tour.price.data.adults_price.USD).toFixed()
        case 'EUR':
          return '€' + Number(this.tour.price.data.adults_price.EUR).toFixed()
        case 'GBP':
          return '£' + Number(this.tour.price.data.adults_price.GBP).toFixed()
        case 'CAD':
          return '$' + Number(this.tour.price.data.adults_price.CAD).toFixed()
        case 'AUD':
          return '$' + Number(this.tour.price.data.adults_price.AUD).toFixed()
      }
    },
    getDiscountPrice () {
      // return this.tour.price['adults_price'][this.currency]['exchangeAmount']
      switch (this.$store.state.Common.currency) {
        case 'USD':
          return '$' + Number(this.tour.priceDiscount.data.adults_price.USD).toFixed()
        case 'EUR':
          return '€' + Number(this.tour.priceDiscount.data.adults_price.EUR).toFixed()
        case 'GBP':
          return '£' + Number(this.tour.priceDiscount.data.adults_price.GBP).toFixed()
        case 'CAD':
          return '$' + Number(this.tour.priceDiscount.data.adults_price.CAD).toFixed()
        case 'AUD':
          return '$' + Number(this.tour.priceDiscount.data.adults_price.AUD).toFixed()
      }
    },
    getDiscountValue () {
      var value = (this.tour.price.data.adults_price.USD - this.tour.discount) * 100 / this.tour.price.data.adults_price.USD
      return Math.round(value * 100 / 100)
    },
    getImage (bLoading) {
      if (bLoading) {
        if (this.tour.image !== undefined) {
          return this.tour.image + '?w=80'
        } else {
          return this.tour.featuredImage + '?w=80'
        }
      } else {
        if (this.tour.image !== undefined) {
          return this.tour.image + '?w=500'
        } else {
          return this.tour.featuredImage + '?w=500'
        }
      }
    }
  },
  data () {
    return {
      medals: {
        'Gold': 'Gold tours have VIP access or a unique luxury itinerary.',
        'Silver': 'Silver tours have small groups & skip the line access, guaranteed.',
        'Bronze': 'Our most affordable tours compromise on group size (up to 25), not quality.'
      }
    }
  }
}
</script>

