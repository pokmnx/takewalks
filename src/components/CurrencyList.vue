<template>
  <div class="topnav-dropdown">
    <a
      v-for="currency in currencies"
      v-bind:key="currency.name"
      v-on:click="changeCurrency"
      :id="currency.name"
      v-if="currency.name != currentCurrency()"
    >
      {{ currency.symbol + " " + currency.name }}
    </a>
  </div>
</template>

<script>

import $ from 'jquery'
import { mapGetters } from 'vuex'

export default {
  name: 'CurrencyList',
  data () {
    return {
      currencies: [
        { name: 'EUR', symbol: '€' },
        { name: 'USD', symbol: '$' },
        { name: 'GBP', symbol: '£' },
        { name: 'CAD', symbol: '$' },
        { name: 'AUD', symbol: '$' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'currency'
    ])
  },
  methods: {
    currentCurrency () {
      return this.currency
    },
    changeCurrency (event) {
      console.log('currency changed' + event.currentTarget.id)
      var symbol = ''
      for (var index in this.currencies) {
        if (this.currencies[index].name === event.currentTarget.id) {
          symbol = this.currencies[index].symbol
          break
        }
      }
      $('.currency-select-value').text(symbol + ' ' + event.currentTarget.id)
      this.$store.commit('setCurrency', event.currentTarget.id)
    }
  }
}
</script>

