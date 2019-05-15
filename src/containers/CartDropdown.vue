<template>
  <div class="sidebar shopping-cart hidden">
    <div class="sidebar-heading">
      <h2 class="heading">Cart</h2>
      <div class="close-cart">
        <svgicon name="close" class="icon icon-close icon-grey" width="24" height="24" />
      </div>
    </div>

    <div class="cart-item-container">
      <CartItem v-for="(cart, index) in this.carts"
      v-bind:key="index"
      :cart="cart"
      />
    </div>

    <div class="right-sidebar-item">
      <div class="sidebar-content cta">
        <h5 class="subtitle grey">{{ getSubTotalTitle() }}</h5>
        <h2 class="subtotal-price default">{{ getTotalPrice() }}</h2>
        <router-link v-if="this.carts.length > 0" :to="{path: '/payment/'}" exact class="btn primary purple">
          Checkout
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import CartItem from '@/components/CartItem'

export default {
  name: 'CartDropdown',
  computed: {
    ...mapGetters([
      'carts',
      'currency'
    ])
  },
  components: {
    CartItem
  },
  methods: {
    getSubTotalTitle () {
      if (this.carts.length > 0) {
        return 'Subtotal'
      } else {
        return ' '
      }
    },
    getTotalPrice () {
      var total = 0
      for (var ind in this.carts) {
        var item = this.carts[ind]
        var subTotal = 0
        for (var index in item.guests) {
          var guest = item.guests[index]
          subTotal += this.convertPrice(item, guest)
        }
        total += subTotal
      }

      if (this.carts.length > 0) {
        return this.convertFormatPrice(total)
      } else {
        return 'EMPTY'
      }
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
      return price
    }
  }
}
</script>
