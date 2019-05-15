<template>
  <div>

    <div class="topnav">
      <HamburgerMenuButton />
      <Logo />
      <div class="topnav-nav">
        <div class="topnav-item nav-mobile nav-mobile-home">
          <router-link to="/" class="link">Home</router-link>
        </div>
        <CityList
          continent="Europe"
          :cities="europeCities"
        />
        <CityList
          continent="USA"
          :cities="usaCities"
        />

        <HelpOptions :options="helpDropdown" label="Help"/>

        <!-- <div class="topnav-item nav-mobile nav-mobile-home nav-mobile-contact">
        <HelpOptions :options="helpDropdown" label="Help"/>

        </div>
        <div class="topnav-item non-destination topnav-contact-link nav-mobile nav-mobile-contact-hide"
        style="background:none !important; margin-right:25px !important;">
        </div> -->
      </div>
      <div class="topnav-right">
        <div v-if="isLogged" class="topnav-user topnav-item nav-mobile">
          <span>Hello {{user.fname}}</span>
          <div class="caret"></div>
          <div class="topnav-dropdown">
            <router-link to="/account">Account</router-link>
            <router-link to="/wishlist">WishList</router-link>
            <router-link to="/past_tours">Past Tours</router-link>
            <a @click="logout">Log Out</a>
          </div>
        </div>
        <div class="topnav-item currency-select-item">
          <a href="#" class="link currency-select-value">{{ getCurrencyLabel() }}</a>
          <CurrencyList v-if="isConfirmationPage() === false" />
        </div>
        <HeaderCartButton v-show="isNotPaymentPage()" v-if="this.carts.length > 0" :amount="this.carts.length"/>
        <HeaderCartButton v-show="isNotPaymentPage()" v-else />
      </div>
    </div>
    <!-- Promo banner -->
    <!-- <div class="promo-header">
      <div class="container">
        <div class="txt-center">
           <span>EXTENDED - 20% OFF ALL TOURS!</span> Until 2PM CT on Tuesday, March 19. Use Promo Code: <span>WALKS20</span>
        </div>
      </div>
    </div> -->


  </div>

</template>

<script>

import $ from 'jquery'
import HamburgerMenuButton from '@/components/HamburgerMenuButton'
import Logo from '@/components/Logo'
import CityList from '@/components/CityList'
import CurrencyList from '@/components/CurrencyList'
import HeaderCartButton from '@/components/HeaderCartButton'
import HelpOptions from '@/components/HelpOptions'

import { mapGetters } from 'vuex'

export default {
  name: 'Header',
  components: {
    HamburgerMenuButton,
    Logo,
    CityList,
    CurrencyList,
    HeaderCartButton,
    HelpOptions
  },
  computed: {
    ...mapGetters([
      'isLogged',
      'user',
      'currency',
      'carts'
    ])
  },
  data () {
    return {
      helpDropdown: [
        { name: 'Help Center', route: 'https://help.takewalks.com' },
        { name: 'Contact Us', route: '/contact/', relativePath: true }
      ],
      europeCities: [
        { name: 'Rome', router: '/rome-tours/' },
        { name: 'Florence', router: '/florence-tours/' },
        { name: 'Venice', router: '/venice-tours/' },
        { name: 'Milan', router: '/milan-tours/' },
        { name: 'Pompeii', router: '/pompeii-tours/' },
        { name: 'Paris', router: '/paris-tours/' },
        { name: 'Barcelona', router: '/barcelona-tours/' },
        { name: 'London', router: '/london-tours/' },
        { name: 'Madrid', router: '/madrid-tours/' },
        { name: 'Athens', router: '/athens-tours/' }
      ],
      usaCities: [
        { name: 'New York', router: '/new-york-tours/' },
        { name: 'San Francisco', router: '/san-francisco-tours/' },
        { name: 'New Orleans', router: '/new-orleans-tours/' }
      ]
    }
  },
  methods: {
    logout () {
      var self = this
      $('body').css({cursor: 'wait'})
      this.$store.dispatch('logout').then(() => {
        $('body').css({cursor: 'default'})
        self.$router.push({path: '/'})
      }, reason => {
        $('body').css({cursor: 'default'})
        console.log(reason)
      })
    },
    getCurrencyLabel () {
      if (this.currency === 'USD' || this.currency === 'CAD' || this.currency === 'AUD') {
        return '$ ' + this.currency
      } else if (this.currency === 'GBP') {
        return '£ ' + this.currency
      } else if (this.currency === 'EUR') {
        return '€ ' + this.currency
      }
    },
    isNotPaymentPage () {
      if (this.$route.path === '/payment' || this.$route.path === '/confirm' || this.$route.path === '/payment/' || this.$route.path === '/confirm/') {
        return false
      } else {
        return true
      }
    },
    isConfirmationPage () {
      if (this.$route.path === '/confirm') {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    var self = this
    var hideActiveSidebar = function () {
      var $sidebar = $('.sidebar.active')
      $sidebar.removeClass('active').hide()
    }

    $('.topnav-cart').click(function () {
      hideActiveSidebar()
      $('.sidebar.shopping-cart')
        .show()
        .addClass('active')
    })

    $('.top-nav-login').click(function () {
      hideActiveSidebar()
      if (self.isLogged !== true) {
        $('.login-sidebar-buttons .error-message').hide()
        $('.sidebar.login-sidebar-login')
          .show()
          .addClass('active')
        if ($(this).hasClass('open-register')) {
          $('.sidebar.login-sidebar-login #btnSignUp').trigger('click')
        }
      }
    })

    $('.top-nav-register').click(function () {
      hideActiveSidebar()
      $('.login-sidebar-buttons .error-message').hide()
      $('.sidebar.login-sidebar-register')
        .show()
        .addClass('active')
      $('.login-sidebar-register .btn-toggler[data-toggle-toggler=booked]').trigger('click')
    })

    $('.top-nav-forgot-password').click(function () {
      $('.login-sidebar-buttons .error-message').hide()
      $('html, body').animate({ scrollTop: '0px' })
      hideActiveSidebar()
      $('.sidebar.login-sidebar-forgot-password')
        .show()
        .addClass('active')
    })

    $('.close-cart').click(hideActiveSidebar)

    var $toggler = $('.mobile-menu-btn')

    $toggler.click(function (e) {
      var target = $('.topnav-nav')

      if (!target.is(':visible')) {
        $(this).addClass('active')
        target.show()
        target.css('top')
        target.addClass('active')
      } else {
        $(this).removeClass('active')
        target.removeClass('active')
        setTimeout(function () {
          target.hide()
        }, 200)
      }
    })
  }
}
</script>
