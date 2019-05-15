<template>
  <div id="app" canvas="container">
    <Header />
    <router-view />
    <div v-if="isTourDetailPage() === false" class="back-to-top default">
      <svgicon name="arrow-upward" class="icon icon-arrow-upward" width="16" height="16" />
    </div>
    <Footer />
    <CartDropdown />
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'
import Header from '@/containers/Header'
import Footer from '@/containers/Footer'
import Login from '@/containers/login/login'
import Register from '@/containers/login/register'
import ForgotPassword from '@/containers/login/forgot_password'
import CartDropdown from '@/containers/CartDropdown'
import FlashMessage from '@/components/FlashMessage'
import { mapGetters } from 'vuex'

import '@/assets/svgicon'

export default {
  components: {
    Header,
    Footer,
    CartDropdown,
    FlashMessage
  },
  computed: {
    ...mapGetters([
      'currency',
      'carts'
    ]),
    bAllLoaded () {
      return this.$store.state.Home.bAllLoaded
    }
  },
  metaInfo () {
    return {
      title: 'Take Walks | Small Group Tours in Italy, NYC & Paris',
      meta: [
        {
          charset: 'utf-8'
        },
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1.0'
        },
        {
          vmid: 'description',
          name: 'description',
          content: 'The greatest cities in the world with the best company. Our local-led, small group tours in Italy, France & the US offer unique experiences & insight.'
        },
        {
          name: "theme-color",
          content: "#ffffff"
        },
        {
          name: "HandheldFriendly",
          content: "true"
        },
        {
          name: "MobileOptimized",
          content: "320"
        },
        {
          'http-equiv': 'X-UA-Compatible',
          content: 'IE=edge'
        },
        {
          'property': 'og:site_name',
          'content': 'TakeWalks'
        },
        {
          'property': 'og:locale',
          'content': 'en_US'
        }
      ]
    }
  },
  name: 'app',
    beforeCreate () {
    var self = this
    var onSuccess = function (geoipResponse) {
      console.log(geoipResponse)
      switch (geoipResponse.continent.code) {
        case 'NA':
        if (geoipResponse.country.iso_code === 'CA') {
            self.$store.commit('setCurrency', 'CAD')
            Vue.localStorage.set('defaultCurrency', 'CAD')
            Vue.localStorage.set('CriteoID', '58152')
          } else {
            self.$store.commit('setCurrency', 'USD')
            Vue.localStorage.set('defaultCurrency', 'USD')
            Vue.localStorage.set('CriteoID', '58152')
          }
          break
        case 'EU':
          (function () {
            if (typeof window.R === 'undefined') {
              var s = document.createElement('script')
              s.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/1.0.10/cookieconsent.min.js')
              window.cookieconsent_options = {"message":'TakeWalks needs to place cookies on your computer in order for you to access all of the features of our website. To learn more about how we use cookies to store information ',"dismiss":"I Agree","learnMore":"click here","link":"https://www.takewalks.com/cookies-policy","theme":"dark-top"}
              document.body.appendChild(s)  // this appends the script to the body you can also use document.head.appendChild(s) to append to the head
            }
          }())
          if (geoipResponse.country.iso_code === 'GB') {
            self.$store.commit('setCurrency', 'GBP')
            Vue.localStorage.set('defaultCurrency', 'GBP')
            Vue.localStorage.set('CriteoID', '58152')
          } else {
            self.$store.commit('setCurrency', 'EUR')
            Vue.localStorage.set('defaultCurrency', 'EUR')
            Vue.localStorage.set('CriteoID', '58152')
          }
          break
        case 'OC':
          if (geoipResponse.country.iso_code === 'AU') {
            self.$store.commit('setCurrency', 'AUD')
            Vue.localStorage.set('defaultCurrency', 'AUD')
            Vue.localStorage.set('CriteoID', '58152')
          } else {
            self.$store.commit('setCurrency', 'USD')
            Vue.localStorage.set('defaultCurrency', 'USD')
            Vue.localStorage.set('CriteoID', '58152')
          }
          break
        default:
          self.$store.commit('setCurrency', 'USD')
          Vue.localStorage.set('defaultCurrency', 'USD')
          Vue.localStorage.set('CriteoID', '58152')
      }
    }
    var onError = function (error) {
      Vue.localStorage.set('defaultCurrency', 'USD')
      Vue.localStorage.set('CriteoID', '58152')
      return
    }
    geoip2.country(onSuccess, onError)
  },
  created () {
    this.$store.commit('addCart', null)
    if (Vue.localStorage.get('BookingID')) {
      this.$store.commit('setBookingID', Vue.localStorage.get('BookingID'))
    }
  },
  mounted () {
    var deviceType = /iPad/.test(navigator.userAgent) ? "t" : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : "d";
    Vue.localStorage.set('deviceType', deviceType)
    $('body').scroll(function () {
      let top = $('body').scrollTop()
      let $tofix = $('.city-tours-header')
      let w = $(window).width()

      if (w >= 1024) {
        if ($tofix.length) {
          if (top > $tofix.offset().top && !$tofix.hasClass('compact')) {
            $tofix.addClass('compact')
          }
          if (top < 140) {
            $tofix.removeClass('compact')
            // top < $tofix.offset().top
          }
        }
      }
    })
    if ($.fn.select2) {
      $('.single-select').select2({
        minimumResultsForSearch: -1
      })
      $(".single-select-country, .single-select-state").select2({
          minimumResultsForSearch: 1
      })
      $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
        $('.single-select-country, .single-select-state').select2({
          matcher: oldMatcher(matchStart)
        })
      })
      function matchStart (term, text) {
        console.log(text.toUpperCase())
        if (text.toUpperCase().replace(/\s/g, '').indexOf(term.toUpperCase()) === 0) {
          return true
        }

        return false
      }
    }
    // this.scrollToItem()
    // this.scrollToSpy()
    this.mobileBtn()
    this.wrapNavButtons()
    this.toggleMobileNavAccordion()
    this.backToTop()
  },
  methods: {
    isTourDetailPage () {
      var city = this.$route.params.city
      var slug = this.$route.params.slug
      var path = this.$route.path
      if (city !== undefined && slug !== undefined && path.includes('compare') === false) {
        return true
      }
      return false
    },
    isRenderable () {
      // return true
      if (this.$route.fullPath === '/') {
        return this.$store.state.Home.bAllLoaded
      }
      return true
    },
    // scrollToItem () {
    //   let $a = $('.city-tour-tabs .tab-item')
    //   $a.click(function () {
    //     let id = $(this).attr('href')
    //     let headerHeight
    //     headerHeight = 0

    //     if (!$('.city-tours-header').hasClass('compact')) {
    //       headerHeight = $('.city-tours-header').outerHeight()
    //     } else {
    //       headerHeight = 0
    //     }
    //     let top
    //     if ($(window).width() >= 1024) {
    //       top = $(id).offset().top - headerHeight
    //     } else {
    //       top = $(id).offset().top + 60
    //     }
    //     if (id === '#mostPopular') {
    //       top = 0
    //       if (
    //         $(window).scrollTop() + 200 <
    //         $(id).offset().top + $(id).outerHeight()
    //       ) {
    //         return false
    //       }
    //     }
    //     $('html, body').animate(
    //       {
    //         scrollTop: top - 60
    //       },
    //       400
    //     )
    //   })
    //   $('[data-scroll-toggler]').click(function () {
    //     let attr = $(this).attr('data-scroll-toggler')
    //     if (!$(this).hasClass('city-tour-tab')) {
    //       $('html, body').animate(
    //         {
    //           scrollTop: $('[data-scroll-target=' + attr + ']').offset().top
    //         },
    //         400
    //       )
    //     } else {
    //       $('html, body').animate(
    //         {
    //           scrollTop: $('[data-scroll-target=' + attr + ']').offset().top - 50
    //         },
    //         400
    //       )
    //     }
    //   })
    // },
    // scrollToSpy () {
    //   let lastId
    //   let topMenu = $('.city-tour-tabs, .city-nav-tabs:not(.my-account-tabs)')
    //   let topMenuHeight = topMenu.outerHeight() + 15
    //   // All list items
    //   let menuItems = topMenu.find('a')
    //   // Anchors corresponding to menu items
    //   let scrollItems = menuItems.map(function () {
    //     let item = $($(this).attr('href'))
    //     if (item.length) {
    //       return item
    //     }
    //   })
    //   // Bind to scroll
    //   $('body').scroll(function () {
    //     // Get container scroll position
    //     let fromTop = $(this).scrollTop() + topMenuHeight
    //     // Get id of current scroll item
    //     let cur = scrollItems.map(function () {
    //       if ($(this).offset().top < fromTop) return this
    //     })
    //     // Get the id of the current element
    //     cur = cur[cur.length - 1]
    //     let id = cur && cur.length ? cur[0].id : ''
    //     if (lastId !== id) {
    //       lastId = id
    //       console.log(id)
    //       // Set/remove active class
    //       menuItems.removeClass('active')
    //       menuItems.filter('[href=\'#' + id + '\']')
    //       menuItems.addClass('active')
    //     }
    //   })
    // },
    mobileBtn () {
      var controller = new slidebars()
      controller.init()

      var $menu = $('.topnav .topnav-nav')
      var $offcanvas = $('#offcanvas')
      var w = $(window).width()

      $(window).resize(function () {
        w = $(window).width()
        if (w >= 1024) {
          $menu.css('display', 'flex')
        }
      })
      $('.mobile-menu-btn').on('click', function (event) {
        console.log('mobile-menu-btn - clicked ' + event)
        w = $(window).width()

        if (w <= 1024) {
          if (!$offcanvas.find('.topnav-nav').length) {
            $offcanvas.append('<svg version="1.1" viewBox="0 0 20 20" class="icon icon-close js-close-any icon-grey svg-icon svg-fill" style="width: 32px; height: 32px; padding: 8px;"><path pid="0" _fill="#BAC5C9" d="M20 .98L19.02 0 10 9.02.98 0 0 .98 9.02 10 0 19.02l.98.98L10 10.98 19.02 20l.98-.98L10.98 10z"></path></svg>')
            $offcanvas.append($menu.clone())
          }
          $offcanvas.find('.topnav-nav').addClass('active')
          // $menu.hide()
        }

        event.stopPropagation()
        event.preventDefault()
        controller.toggle('id-1')
        $('[canvas="container"]').toggleClass('disable-scroll')
        $('[canvas="container"]').addClass('open')
        $('html, body').toggleClass('slidebar-open')
        $('[off-canvas]').toggleClass('open')

        if ($('[canvas="container"]').hasClass('open')) {
          setTimeout(function () {
            $('[canvas="container"]').removeClass('open')
          }, 300)
        }
      })

      $(document).on('touchend click', '.js-close-any', function (event) {
        if (controller.getActiveSlidebar()) {
          controller.close()
          $('[canvas="container"]').toggleClass('disable-scroll')
          $('[canvas="container"]').addClass('open')
          $('html, body').toggleClass('slidebar-open')
          $('[off-canvas]').toggleClass('open')

          if ($('[canvas="container"]').hasClass('open')) {
            setTimeout(function () {
              $('[canvas="container"]').removeClass('open')
            }, 300)
          }
        }
      })
    },
    wrapNavButtons () {
      if ($(window).width() <= 1024) {
        $('.topnav-item.non-destination').wrapAll(
          '<div class="topnav-item mobile-cta-buttons"></div>'
        );
      }
    },
    toggleMobileNavAccordion () {
      var $toggler = $('[data-country-toggler] .link');
      var $target = $('[data-country-target]');
      var w = $(window).width();

      if (w > 640) return

      $(document).on('click', $toggler, function(e) {
        var attr = $(e.target).closest('[data-country-toggler]').attr("data-country-toggler");
        var target = $("[data-country-target=" + attr + "]");
        $(e.target).closest('[data-country-toggler]').toggleClass('active')
        target.toggleClass('active')
        var activeNum = $("[data-country-target].active").length / 2

        if (activeNum > 1) {
          $('[data-country-target]').css('max-height', parseFloat((100 - 20) / activeNum ) + 'vh')
        } else {
          $('[data-country-target]').css('max-height', '')
        }
      });

      $toggler.append('<svg version="1.1" viewBox="0 0 17.005 31.998" class="icon icon-arrow_left svg-icon svg-fill" style="width: 18px; height: 18px;"><path fill="#a9b3ba" stroke="none" pid="0" _fill="#B8C2C8" d="M16.743.248a.888.888 0 0 0-1.23 0L.263 15.388a.84.84 0 0 0 0 1.22l15.25 15.14c.17.17.39.25.62.25.22 0 .44-.08.61-.25.35-.34.35-.88 0-1.21l-14.63-14.54 14.63-14.54a.83.83 0 0 0 0-1.21z"></path></svg>');
    },
    backToTop() {
      if ($('.back-to-top').length) {
        $(window).scroll(function() {
          if ($(window).scrollTop() >= 400) {
            $('.back-to-top').addClass('active')
          } else {
            $('.back-to-top').removeClass('active')
          }
        });
      }

      $('.back-to-top').click(function() {
        if ($('html').hasClass('eventDetail')) {
          console.log('has')
          $('html, body').animate({
            scrollTop: $('.right-book').offset().top
          }, 400)
        } else {
          $('html, body').animate({
            scrollTop: 0
          }, 400)
        }
      })
    }
  }
}
</script>

<style lang='scss'>
  @import 'assets/sass/app.scss'
</style>
