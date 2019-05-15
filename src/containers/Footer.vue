<template>
  <div class="footer">
    <div class="footer-upper">
      <div class="footer-select">
        <div>
          <div class="currency-select-text">
            <span class="currency-select-value">{{ getCurrencyLabel() }}</span>
            <div class="triangle"></div>
            <CurrencyList v-if="isConfirmationPage() === false" />
          </div>
        </div>
      </div>
      <FooterLinks />
      <Subscriber />
    </div>
    <div class="footer-copyright">
      
      <div class="social">
        <!-- Connect With Us -->
        <SocialLink
          link="https://www.facebook.com/walkingtours"
          name="facebook"
        />
        <SocialLink
          link="https://twitter.com/walks"
          name="twitter"
        />
        <SocialLink
          link="https://www.instagram.com/walkstours"
          name="instagram"
        />
      </div>
      <RightNote />
    </div>
  </div>
</template>

<script>

import CurrencyList from '@/components/CurrencyList'
import FooterLinks from '@/components/FooterLinks'
import Subscriber from '@/components/Subscriber'
import RightNote from '@/components/RightNote'
import SocialLink from '@/components/SocialLink'

import { mapGetters } from 'vuex'

export default {
  name: 'Footer',
  components: {
    CurrencyList,
    FooterLinks,
    Subscriber,
    RightNote,
    SocialLink
  },
  computed: {
    ...mapGetters([
      'currency'
    ])
  },
  methods: {
    isConfirmationPage () {
      if (this.$route.path === '/confirm') {
        return true
      } else {
        return false
      }
    },
    getCurrencyLabel () {
      if (this.currency === 'USD' || this.currency === 'CAD' || this.currency === 'AUD') {
        return '$ ' + this.currency
      } else if (this.currency === 'GBP') {
        return '£ ' + this.currency
      } else if (this.currency === 'EUR') {
        return '€ ' + this.currency
      }
    }
  }
}
</script>
