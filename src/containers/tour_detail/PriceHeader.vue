<template>
  <div class="sidebar-heading sidebar-heading-booking">
    <div class="heading heading-price">Price</div>
    <div class="price">
      <div class="original-price"></div>
      <span v-if="!Array.isArray(this.tour.priceDiscount) && this.checkPromo()" class="strike-through widget-strike-through">{{this.getPrice()}}</span>
      <span v-if="!Array.isArray(this.tour.priceDiscount) && this.checkPromo()" class="price-value price-value-datepick">{{this.getDiscountPrice()}}</span>
      <span v-else class="price-value price-value-datepick">{{this.getPrice()}}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PriceHeader',
  computed: {
    ...mapGetters([
      'tour'
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
    getPrice () {
      // return this.tour.price['adults_price'][this.currency]['exchangeAmount']
      switch (this.$store.state.Common.currency) {
        case 'USD':
          return '$' + Number(this.tour.price.adults_price.USD).toFixed()
        case 'EUR':
          return '€' + Number(this.tour.price.adults_price.EUR).toFixed()
        case 'GBP':
          return '£' + Number(this.tour.price.adults_price.GBP).toFixed()
        case 'CAD':
          return '$' + Number(this.tour.price.adults_price.CAD).toFixed()
        case 'AUD':
          return '$' + Number(this.tour.price.adults_price.AUD).toFixed()
      }
    },
    getDiscountPrice () {
      // return this.tour.price['adults_price'][this.currency]['exchangeAmount']
      switch (this.$store.state.Common.currency) {
        case 'USD':
          return '$' + Number(this.tour.priceDiscount.adults_price.USD).toFixed()
        case 'EUR':
          return '€' + Number(this.tour.priceDiscount.adults_price.EUR).toFixed()
        case 'GBP':
          return '£' + Number(this.tour.priceDiscount.adults_price.GBP).toFixed()
        case 'CAD':
          return '$' + Number(this.tour.priceDiscount.adults_price.CAD).toFixed()
        case 'AUD':
          return '$' + Number(this.tour.priceDiscount.adults_price.AUD).toFixed()
      }
    }
  }
}
</script>

