<template>
  <main class="sidebar-layout-left checkout-success">
    <div class="container container-success">
      <div class="main-container book-success">
        <div class="success-heading">
          <svgicon name="checkmark_circled" class="icon-checkmark_circled green" width="100" height="100" style="margin-right: 15px; fill: #57b69d;" />
          <h1 class="page-title">Your tour is booked!</h1>
          <h1 class="page-sub-title">BOOKING REFERENCE: {{ this.confirmed_booking_id }}</h1>
        </div>

        <h2 class="default ">What happens next?</h2>
        <div class="next-descr">
            <div class="next-content">
              <img src="../assets/svg/mail-icon.svg">
              <p>{{ twSuccess.twSuccessInfo01 }}</p>
            </div>
            <br>
            <div class="next-content">
              <img src="../assets/svg/map-icon.svg">
              <p>{{ twSuccess.twSuccessInfo02 }}</p>
            </div>
            <br>
            <div class="next-content">
              <img src="../assets/svg/bubble-icon.svg">
              <p>{{ twSuccess.twSuccessInfo03 }}</p>
            </div>
        </div>


        <div class="mobile-content">
          <div class="sidebar-container success-sidebar-container success-sidebar-container-mobile">
            <br>
            <h2 class="default sidebar-default">Booking Details</h2>
            <div class="sidebar shopping-cart standalone success-shopping-cart">
              <div class="right-sidebar-item success-right-sidebar-item"
                v-for="(tour, index) in this.confirmedCarts"
                v-bind:key="index"
              >
                <div class="sidebar-subheading" style="cursor: default !important;">
                  <div class="checkout-sidebar-item">
                    <a href="#" class="event-title" style="cursor: default !important; pointer-events: none !important;">{{ getEventName(tour) }}</a>
                  </div>
                  <p class="event-date event-date-confirm">{{ getEventDate(tour) }}</p>
                  <div class="checkout-summary">
                    <div class="price-rows">
                      <p class="guest-row"
                        v-for="(guest, index) in tour.guests"
                        v-bind:key="index"
                      >{{ guest.count }} {{ guest.type }} <span>{{ getPrice(tour, guest) }}</span></p>
                    </div>
                    <p v-if="showDiscountInItem(tour)" class="discount-row">Discount {{getDiscountPercent(tour)}}% <span>-{{getDiscountSumPrice(tour, currencyData)}}</span></p>
                    <p class="subtotal-row">Subtotal <span>{{ getSubTotal(tour) }}</span></p>
                  </div>
                </div>
                <div v-if="promoType === 'fixed' && confirmedCarts.length > 0" class="sidebar-subheading">
                  <div class="checkout-summary discount-total">
                    <p  class="discount-row">Discount  <span>- {{ convertFormatPrice(totalFixedPromoDiscountAmount[currency], currency) }}</span></p>
                  </div>
                </div>
              </div>
              <div class="sidebar-heading">
                  <div class="heading heading-price-confirm">Price</div>
                  <div class="price">{{ getTotalPrice(currencyData) }}</div>
              </div>
            </div>
          </div>
          <br>
          <br>
          <!-- 
            DO NOT REMOVE - this is the meeting point section
            might need it later
           -->
          <!-- <h2 class="default">Where will we meet?</h2>
          <div
            v-for="(tour, index) in this.confirmedCarts"
            v-bind:key="index"
            >
            <div class="meeting-content">
              <div class="meeting-address">
                <h2>{{ getEventName(tour) }}</h2>
                <p>{{ getEventDate(tour) }}</p>
                <p class="meeting-address" v-html='tour.meetingPointAddress.replace(/,/gi, "<br>").replace(/^,/,"")'></p>
              </div>
              <img class="meeting-img" :src="tour.meetingPointMapImage + '?w=320'" >
            </div>
            <a class="map-url" :href="tour.meetingPointMapUrl" target="_blank">Open in google map</a>
          </div>
           -->
        </div>
        <br>
        <img class="city-icon" src="../assets/svg/city-icon.svg">
        <br>
        <div class="contact-sidebar contact-sidebar-mobile">
          <img src="../assets/svg/hand-icon.svg">
          <h2 class="default">{{ twSuccess.twContactHeading }}</h2>
          <div class="sidebar-contact-info">
            <li v-for="contact in getContactInfo()">
              {{ contact }}
            </li>
          </div>
        </div>
        <br>
        <h2 class="default city-title">Other cities we visit</h2>
        <table class="table-cities">
          <tr class="tr-header">
            <th class="europe">Europe</th>
            <th class='empty-cell'></th>
            <th class="usa">USA</th>
          </tr>
          <tr>
            <td><router-link to='rome-tours'>Rome</router-link></td>
            <td><router-link to='pompeii-tours'>Pompeii</router-link></td>
            <td><router-link to='new-york-tours'>New York</router-link></td>
          </tr>
          <tr>
            <td><router-link to='florence-tours'>Florence</router-link></td>
            <td><router-link to='paris-tours'>Paris</router-link></td>
            <td><router-link to='san-francisco-tours'>San Francisco</router-link></td>
          </tr>
          <tr>
            <td><router-link to='venice-tours'>Venice</router-link></td>
            <td><router-link to='barcelona-tours'>Barcelona</router-link></td>
            <td></td>
          </tr>
          <tr>
            <td><router-link to='milan-tours'>Milan</router-link></td>
            <td><router-link to='london-tours'>London</router-link></td>
            <td></td>
          </tr>
        </table>

        <div class="guide-content">
          <img class="promo-img" :src="getPromoImage()" />
          <div class="tw-promo-text-container">
            <h2>{{ twSuccess.twPromoHeading }}</h2>
            <span> {{ twSuccess.twPromoDescription }}</span>
            <a :href="twSuccess.twPromoUrl" target="_blank"><img class="guide-arrow" src="../assets/svg/guide-arrow.svg"></a>
          </div>
          <p class="download-rome"><a :href="twSuccess.twPromoUrl" target="_blank">{{twSuccess.twPromoUrlText.toUpperCase()}}</a></p>
          <br>
        </div>

      </div>

      <div class="sidebar-container success-sidebar-container success-sidebar-container-desk">
        <h2 class="default sidebar-default">Booking Details</h2>
        <div class="sidebar shopping-cart standalone success-shopping-cart">
          <div class="right-sidebar-item success-right-sidebar-item"
            v-for="(tour, index) in this.confirmedCarts"
            v-bind:key="index"
          >
            <div class="sidebar-subheading" style="cursor: default !important;">
              <div class="checkout-sidebar-item">
                <a href="#" class="event-title" style="cursor: default !important; pointer-events: none !important;">{{ getEventName(tour) }}</a>
              </div>
              <p class="event-date event-date-confirm">{{ getEventDate(tour) }}</p>
              <div class="checkout-summary">
                <div class="price-rows">
                  <p class="guest-row"
                    v-for="(guest, index) in tour.guests"
                    v-bind:key="index"
                  >{{ guest.count }} {{ guest.type }} <span>{{ getPrice(tour, guest) }}</span></p>
                </div>
                <p v-if="showDiscountInItem(tour)" class="discount-row">Discount {{getDiscountPercent(tour)}}% <span>-{{getDiscountSumPrice(tour, currencyData)}}</span></p>
                <p class="subtotal-row">Subtotal <span>{{ getSubTotal(tour) }}</span></p>
              </div>
            </div>
            <div v-if="promoType === 'fixed' && confirmedCarts.length > 0" class="sidebar-subheading">
              <div class="checkout-summary discount-total">
                <p  class="discount-row">Discount  <span>- {{ convertFormatPrice(totalFixedPromoDiscountAmount[currency], currency) }}</span></p>
              </div>
            </div>
          </div>
          <div class="sidebar-heading">
              <div class="heading heading-price-confirm">Price</div>
              <div class="price">{{ getTotalPrice(currencyData) }}</div>
          </div>
        </div>
        <div class="contact-sidebar">
          <img src="../assets/svg/hand-icon.svg">
          <h2 class="default">{{ twSuccess.twContactHeading }}</h2>
          <div class="sidebar-contact-info">
            <li v-for="contact in getContactInfo()">
              {{ contact }}
            </li>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>

import $ from 'jquery'
import Vue from 'vue'
import { mapGetters } from 'vuex'
export default {
  name: 'BookConfirmPage',
  computed: {
    ...mapGetters([
      'currency',
      'confirmed_booking_id',
      'status',
      'confirmedCarts',
      'confirmedDiscounts'
    ])
  },
  mounted () {
    $('#launcher').removeClass('launcher-detail')
    this.backToTop()
    console.log(this.confirmedDiscounts)
    this.getPromoType()
    $('html, body').animate({scrollTop: 0}, 400)
    this.dataLayer()
    document.dispatchEvent(new Event('render-event'))
    var self = this
    $(document).ready(function () {
      var viewConfirmCriteo = []
      var cart = self.confirmedCarts
      for (var ind in cart) {
        // criteo
        viewConfirmCriteo.push({
          'id': cart[ind].eventID,
          'price': parseFloat(self.getSubTotal(cart[ind], Vue.localStorage.get('defaultCurrency')).substring(1)),
          'quantity': 1
        })
      }
      if (window._didAsyncInjectGoogleAnalytics) {
        window.dataLayer.push({
          'event': 'CriteoConfirm',
          'PageType': 'TransactionPage',
          'setAccount': Vue.localStorage.get('CriteoID'),
          'setSiteType': Vue.localStorage.get('deviceType'),
          'setHashedEmail': [''],
          'ord': self.confirmed_booking_id,
          'viewListConfirmation': viewConfirmCriteo
        })
      }
    })
    for (var ind in this.confirmedCarts) {
      var item = this.confirmedCarts[ind]
      if (item.product_locator !== '') {
        $('.wowo-title').show()
        $('.wowo-descr').show()
        return
      }
    }
  },
  methods: {
    backToTop () {
      if ($('.back-to-top').length) {
        $(window).scroll(function () {
          if ($(window).scrollTop() >= 400) {
            $('.back-to-top').addClass('active')
          } else {
            $('.back-to-top').removeClass('active')
          }
        })
      }
      $('.back-to-top').click(function () {
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
    },
    /**
     * if one of the promo fields is empty,
     * hide promo component
     */
    isPromo (data) {
      var fieldsNotNull = (data.twPromoHeading &&
        data.twPromoDescription &&
        data.twPromoUrl &&
        data.twPromoUrl &&
        data.twPromoUrlText
      )
      return fieldsNotNull
    },
    getEventDate (item) {
      return item.date
    },
    getEventName (item) {
      return item.name
    },
    getContactInfo () {
      var twSuccess = JSON.parse(Vue.localStorage.get('twSuccess'))
      return twSuccess.twContactInfo
    },
    getPromoImage () {
      var twSuccess = JSON.parse(Vue.localStorage.get('twSuccess'))
      return 'https:' + twSuccess.twPromoImage.fields.file.url
    },
    wowoSchedule () {
      window.open('http://wowo.takewalks.com/walkonwalkoff/')
    },
    showDiscountInItem (item) {
      if (this.promoType === 'percentage' && this.confirmedDiscounts.length > 0 && this.getDiscountPercent(item) > 0) {
        return true
      } else {
        return false
      }
    },
    getPrice (item, guest) {
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
          price = price.USD * guest.count
          return price.toFixed(2)
        case 'EUR':
          price = price.EUR * guest.count
          return price.toFixed(2)
        case 'GBP':
          price = price.GBP * guest.count
          return price.toFixed(2)
        case 'CAD':
          price = price.CAD * guest.count
          return price.toFixed(2)
        case 'AUD':
          price = price.AUD * guest.count
          return price.toFixed(2)
      }
      return price
    },
    getSubTotal (item) {
      var subTotal = 0
      for (var index in item.guests) {
        var price = 0
        var guest = item.guests[index]
        if (guest.type === 'adults') {
          price = guest.count * item.price.adults_price[this.currency]
        } else if (guest.type === 'infants') {
          price = guest.count * item.price.infants_price[this.currency]
        } else if (guest.type === 'children') {
          price = guest.count * item.price.children_price[this.currency]
        } else {
          price = guest.count * item.price.students_price[this.currency]
        }
        subTotal += price
      }
      if (this.confirmedDiscounts.length > 0) {
        subTotal -= this.getDiscountSumPriceValue(item, this.currency)
      }
      return this.convertFormatPrice(subTotal, this.currency, item.price)
    },
    getTotalPrice () {
      var total = 0
      for (var ind in this.confirmedCarts) {
        var item = this.confirmedCarts[ind]
        var subTotal = 0
        for (var index in item.guests) {
          var price = 0
          var guest = item.guests[index]
          if (guest.type === 'adults') {
            price = guest.count * item.price.adults_price[this.currency]
          } else if (guest.type === 'infants') {
            price = guest.count * item.price.infants_price[this.currency]
          } else if (guest.type === 'children') {
            price = guest.count * item.price.children_price[this.currency]
          } else {
            price = guest.count * item.price.students_price[this.currency]
          }
          subTotal += price
        }
        if (this.confirmedDiscounts.length > 0) {
          subTotal -= this.getDiscountSumPriceValue(item, this.currency)
        }
        total += subTotal
      }
      if (this.confirmedDiscounts.length > 0) {
        if (this.promoType === 'fixed') {
          total -= this.getDiscountAmount()
          console.log(total)
        }
      }

      if (this.confirmedCarts.length > 0) {
        return this.convertFormatPrice(total, this.currency, this.confirmedCarts[0].price)
      } else {
        return '0'
      }
    },
    getPromoType () {
      for (var index in this.confirmedDiscounts) {
        var discount = this.confirmedDiscounts[index]
        if (discount.imported_promo_type === 'fixed' && discount.imported_promo_amount > 0) {
          this.promoType = 'fixed'
          this.fixedPromoAmount = discount.imported_promo_amount
          for (var index2 in discount.currency_exchange) {
            var currency = discount.currency_exchange[index2]
            if (currency.currency_code in this.totalFixedPromoDiscountAmount) {
              this.totalFixedPromoDiscountAmount[currency.currency_code] += (currency.amount_full_price - currency.amount)
            } else {
              this.totalFixedPromoDiscountAmount[currency.currency_code] = (currency.amount_full_price - currency.amount)
            }
          }
        } else if (discount.imported_promo_type === 'percentage' && this.promoType !== 'fixed') {
          this.promoType = 'percentage'
        }
      }
    },
    getDiscountAmount () {
      if (this.promoType === 'fixed') {
        console.log('getDiscountAmount')
        console.log(this.totalFixedPromoDiscountAmount[this.currency])
        return this.totalFixedPromoDiscountAmount[this.currency]
      }
    },
    convertPrice (item, guest, currency) {
      var price = 0

      if (guest === undefined) {
        return price
      }

      if (guest.type === 'adults') {
        price = item.price.adults_price
      } else if (guest.type === 'infants') {
        price = item.price.infants_price
      } else if (guest.type === 'children') {
        price = item.price.children_price
      } else {
        price = item.price.students_price
      }

      if (currency === undefined) {
        currency = this.currency
      }

      switch (currency) {
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
    convertFormatPrice (price, currency) {
      if (price === 0) {
        return 'FREE'
      }

      if (currency === undefined) {
        currency = this.currency
      }

      switch (currency) {
        case 'USD':
          return '$' + parseFloat(Math.round(price * 100) / 100).toFixed(2)
        case 'EUR':
          return '€' + parseFloat(Math.round(price * 100) / 100).toFixed(2)
        case 'GBP':
          return '£' + parseFloat(Math.round(price * 100) / 100).toFixed(2)
        case 'CAD':
          return '$' + parseFloat(Math.round(price * 100) / 100).toFixed(2)
        case 'AUD':
          return '$' + parseFloat(Math.round(price * 100) / 100).toFixed(2)
      }
      return price
    },
    getDiscountSumPriceValue (item, currency) {
      var subTotal = 0
      if (this.promoType === 'percentage') {
        for (var index in item.guests) {
          var guest = item.guests[index]
          var realPrice = this.convertPrice(item, guest, currency)
          var value = realPrice
          value = realPrice * this.getDiscountPercent(item) / 100
          subTotal += value
        }
      }
      return subTotal
    },
    getDiscountSumPrice (item) {
      var subTotal = this.getDiscountSumPriceValue(item, this.currency)
      return this.convertFormatPrice(subTotal, this.currency)
    },
    showDiscount (item) {
      if (this.confirmedDiscounts.length > 0 && this.getDiscountPercent(item) > 0) {
        return true
      } else {
        return false
      }
    },
    getDiscountPercent (item) {
      // return parseFloat(item.price.adults_price.USD - item.discount)
      for (var index in this.confirmedDiscounts) {
        var discount = this.confirmedDiscounts[index]
        if (this.promoType === 'percentage' && discount.stage_id.toString() === item.staging_id.toString()) {
          var currencyExchange = discount.currency_exchange[0]
          var percent = (currencyExchange.amount_full_price - currencyExchange.amount) / currencyExchange.amount_full_price
          return Math.round(percent * 100)
        }
      }
      return 0
    },
    dataLayer () {
      var layerObjects = []
      var total = 0
      for (var ind in this.confirmedCarts) {
        var item = this.confirmedCarts[ind]
        var subTotal = 0
        for (var index in item.guests) {
          var price = 0
          var guest = item.guests[index]
          if (guest.type === 'adults') {
            price = guest.count * item.price.adults_price.USD
          } else if (guest.type === 'infants') {
            price = guest.count * item.price.infants_price.USD
          } else if (guest.type === 'children') {
            price = guest.count * item.price.children_price.USD
          } else {
            price = guest.count * item.price.students_price.USD
          }
          subTotal += price
        }
        if (this.confirmedDiscounts.length > 0) {
          subTotal -= this.getDiscountSumPriceValue(item, 'USD')
        }
        layerObjects.push({'id': item.eventID, 'name': item.name, 'category': 'Tour', 'price': subTotal, 'quantity': '1'})
        total += subTotal
        if (this.confirmedDiscounts.length > 0) {
          if (this.promoType === 'fixed') {
            total -= this.getDiscountAmount()
            console.log(total)
          }
        }
        if (window._didAsyncInjectGoogleAnalytics) {
          window.dataLayer.push({
            'event': 'floodlightConfirm',
            'revenue': subTotal.toFixed(2),
            'orderid': this.confirmed_booking_id,
            'cityName': this.confirmedCarts[ind].city
          })
        }
      }
      if (window._didAsyncInjectGoogleAnalytics) {
        window.dataLayer.push({
          'cost': total.toFixed(2)
        })
        window.dataLayer.push({
          'ord': this.confirmed_booking_id
        })
        window.dataLayer.push({
          'event': 'EC',
          'ecommerce': {
            'currencyCode': 'USD',
            'purchase': {
              'actionField': {
                'id': this.confirmed_booking_id,
                'revenue': total.toFixed(2),
                'affiliation': 'Walks LLC',
                'shipping': '0',
                'tax': '0'
              },
              'products': layerObjects
            }
          }
        })
        window.dataLayer.push({
          'event': 'adwordsConversion',
          'adwordsRevenue': total.toFixed(2),
          'adwordsOrderId': this.confirmed_booking_id
        })
      }
    }
  },
  data () {
    return {
      currencyData: this.currency,
      totalFixedPromoDiscountAmount: {},
      promoType: '',
      twSuccess: JSON.parse(Vue.localStorage.get('twSuccess')),
      wowoCart: false
    }
  }
}
</script>

