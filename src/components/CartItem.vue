<template>
  <div class="right-sidebar-item">
    <div class="sidebar-subheading">
      <router-link :to="cart.slug" class="event-title">
        {{ cart.name }}
      </router-link>
      <!-- Tues, 14 Mar, 2017 at 9:00 am -->
      <p class="event-date">{{ cart.date }}</p>
      <div class="event-options-container" v-for="(option, index) in cart.productLocatorOptionsData" :value="option.stageId">
        <p class="event-options" >{{ option.name }}</p>
        <span class="remove-option remove-option-cart" v-if="!option.required" @click="removeOptionFromCart(option.stageId, cart, index)">Remove Upgrade</span>
      </div>
      <div
        class="guest-select-row"
        v-for="(guest, index) in cart.guests"
        v-bind:key="index"
      >
        <div class="select-item">
          <input type="number" :value="guest.count" readonly>
        </div>
        <div class="guest-label">
          <span>{{ guest.type }}</span>
        </div>
        <div class="guest-price">{{ getPrice(cart, guest) }}</div>
      </div>
      <a @click="removeFromCart()" class="remove-from-cart"><svgicon name="remove_tour" class="icon icon-remove_tour" /><span>Remove from cart</span></a>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'CartItem',
  props: {
    cart: Object
  },
  computed: {
    ...mapGetters([
      'currency'
    ])
  },
  methods: {
    getPrice (item, guest) {
      var realPrice = this.convertPrice(item, guest)
      return this.convertFormatPrice(realPrice)
    },
    convertPrice (item, guest) {
      var price = 0
      if (guest.type === 'adults') {
        price = item.price.adults_price
      } else if (guest.type === 'infants') {
        price = item.price.infants_price
      } else if (guest.type === 'children') {
        price = item.price.children_price
      } else {
        price = item.price.students_price
      }
      switch (this.currency) {
        case 'USD':
          return price.USD * guest.count
        case 'EUR':
          return price.EUR * guest.count
        case 'GBP':
          return price.GBP * guest.count
        case 'CAD':
          return price.CAD * guest.count
        case 'AUD':
          return price.AUD * guest.count
      }
      return price
    },
    convertFormatPrice (price) {
      if (price === 0) {
        return ''
      }
      switch (this.currency) {
        case 'USD':
          return '$' + price.toFixed(2)
        case 'EUR':
          return '€' + price.toFixed(2)
        case 'GBP':
          return '£' + price.toFixed(2)
        case 'CAD':
          return '$' + price.toFixed(2)
        case 'AUD':
          return '$' + price.toFixed(2)
      }
      return price.toFixed(2)
    },
    removeFromCart () {
      this.$store.dispatch('removeCart', this.cart)
    },
    removeOptionFromCart (stageId, item, optionIndex) {
      this.$store.dispatch('removeOptionCart', {item, stageId, optionIndex})
    }
  }
}
</script>
