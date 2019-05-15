<template>
  <main class="sidebar-layout-left payment payment-container container">
    <!-- The Modal -->
    <div id="myModal2" class="modal3">
      <img class="close" src="../assets/svg/close-booking-widget.svg" alt="">
      <div class="terms-content">
        <TermsPageModal />
      </div>
      <div class="terms-footer">
        <button class="btn green close-terms">Ok, close</button>
      </div>
    </div>
    <div class="container non-container">
      <img class="checkout-logo" src="../assets/svg/checkout-cart.svg" ><h1 class="page-title checkout-title">Checkout</h1>
    </div>
    <div class="container non-container">
      <div class="payment-sidebar-container sidebar-container">
          <nav class="currency-nav payment-currency-nav">
            <a class="currency-toggler" data-currency="USD">USD</a>
            <a class="currency-toggler" data-currency="EUR">EUR</a>
            <a class="currency-toggler" data-currency="GBP">GBP</a>
            <a class="currency-toggler" data-currency="CAD">CAD</a>
            <a class="currency-toggler" data-currency="AUD">AUD</a>
          </nav>
        <div class="sidebar shopping-cart standalone payment-shopping-cart ">
          <div class="payment-item-container">
            <h1 v-if="this.carts.length == 0" class="empty-cart-title">Your cart is empty!</h1>
            <div class="right-sidebar-item payment-right-sidebar-item"
              v-for="(item, index) in this.carts"
              v-bind:key="index"
            >
              <div class="sidebar-subheading">
                <div class="checkout-sidebar-item">
                  <router-link :to="item.slug" class="event-title">{{ getEventName(item) }}</router-link>
                  <a class="remove-from-cart remove-from-cart-payment">
                    <img class="payment-widget-close" v-b-toggle.accordion3 src="../assets/svg/close-booking-widget.svg" alt="" @click="removeFromCartWarning(index)">
                  </a>
                </div>
                <div :class="'remove-cart-wrapper remove-cart-wrapper-' + index">
                  <p class="remove-cart-info">Are you sure you want to remove this tour?</p>
                  <br>
                  <button class="btn green remove-cart" @click="removeFromCart(item, index)" >YES</button>
                  <button class="btn green remove-cart" @click="removeFromCartCanceled(index)">NO</button>
                </div>
                <p :class="'event-date payment-event-date payment-event-date-' + index">{{ getEventDate(item) }}</p>
                <div :class="'checkout-summary checkout-summary-' + index ">
                  <div class="price-rows">
                    <p class="payment-guest-row guest-row"
                      v-for="(guest, index) in item.guests"
                      v-bind:key="index"
                    >{{ guest.count }} {{ guest.type }} <span>{{ getPrice(item, guest, currencyData) }}</span></p>
                  </div>
                  <p v-if="showDiscountInItem(item)" class="discount-row">Discount {{getDiscountPercent(item)}}% <span>-{{getDiscountSumPrice(item, currencyData)}}</span></p>
                  <p class="payment-subtotal-row subtotal-row">Subtotal <span>{{ getSubTotal(item, currencyData) }}</span></p>
                </div>
              </div>
            </div>

            <div v-if="promoType === 'fixed' && carts.length > 0" class="sidebar-subheading">
              <div class="checkout-summary discount-total">
                <p  class="discount-row">Discount  <span>- {{ convertFormatPrice(totalFixedPromoDiscountAmount[currency], currency) }}</span></p>
              </div>
            </div>

          </div>
          <div class="sidebar-heading payment-sidebar-heading">
            <h2 class="heading payment-heading">Total</h2>
            <div class="price">{{ getTotalPrice(currencyData) }}</div>
          </div>
        </div>

        <div class="sidebar-payment-item sidebar-promocode">
          <a href="#" class="promo-code promo-code-promo active btn">PROMO CODE</a>
          <a href="#" class="promo-code-applied btn" style="display:none;">PROMO CODE APPLIED</a>
            <div class="promo-error-message" >
              <span class="span-booking-error-message"></span>
            </div>
          <div class="promocode-input">
            <div class="form-d" id="apply_promo_form" style="display: flex;">
              <div class="input-icon">
                <input type="text" name="promo" placeholder="Promo Code">
                <svgicon v-if="showCautionPromo" name="attention" class="icon icon-attention" width="20" height="20" />
                <svgicon v-if="showValidPromo" name="circle-close" class="icon icon-circle-close clear-input clear-input-promo" width="20" height="20" />
              </div>
              <button class="btn promo-btn" @click="applyPromo">
                APPLY
                <svgicon v-if="showValidPromo" name="checkmark" class="icon icon-checkmark" width="12" height="12" />
              </button>
            </div>
          </div>
        </div>

        <div class="sidebar-payment-item sidebar-iata">
          <a href="#" class=" promo-code active btn">IATA CODE <span class="sidebar-title">Travel Agents Only</span></a>
            <div v-if="showErrorIATA" class="iata-error-message" >
              <span class="span-booking-error-message">Sorry, that code is invalid!</span>
            </div>
          <div class="iata-input valid">
            <div style="display: flex;">
              <div class="input-icon">
                <input type="text" name="iata-input" placeholder="IATA code">
                <svgicon v-if="showCautionIATA" name="attention" class="icon icon-attention" width="20" height="20" />
                <svgicon v-if="showValidIATA" name="circle-close" class="icon icon-circle-close clear-input clear-input-iata" width="20" height="20" />
              </div>
              <button class="btn iata-btn" @click="applyIATA">
                APPLY
                <svgicon v-if="showValidIATA" name="checkmark" class="icon icon-checkmark" width="12" height="12" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="payment-main-container  main-container container">
        <form method="post" id="formPayment" data-form-type="payment" >
          <input type="hidden" name="currency">
          <input type="hidden" name="iata">
          <h4 class="input-row-heading input-row-heading-top"><img class="contact-information-icon" v-b-toggle.accordion3 src="../assets/svg/contact-information-2.svg" alt="">
            <br>
            Contact information
          </h4>
          <div class="input-row auto foo-validate">
            <div class="input-div input-icon">
              <label>First Name</label>
              <br>
              <input type="text" name="first_name" placeholder="" value=""
                v-validate="{ required: true, regex: /^[A-Za-z -]+$/ }"
              >
              <img class="validate-icon" v-if="errors.has('first_name')" src="../assets/svg/invalid-input.svg" alt="">
              <img class="validate-icon valid-icon"  v-if="!errors.has('first_name')" src="../assets/svg/valid-input.svg" alt="">
              <span class="payment-error-msg" v-show=" errors.has('first_name') && errors.items[0].rule === 'required'">Please enter your first name.</span>
              <span class="payment-error-msg" v-show=" errors.has('first_name') && errors.items[0].rule === 'regex'">The name field may only contain alphabetic characters.</span>
            </div>
            <div class="input-div input-icon">
              <label>Surname</label>
              <br>
              <input type="text" name="last_name" placeholder="" value=""
                v-validate="{ required: true, regex: /^[A-Za-z -]+$/ }"
              >
              <img class="validate-icon" v-if="errors.has('last_name')" src="../assets/svg/invalid-input.svg" alt="">
              <img class="validate-icon valid-icon"  v-if="!errors.has('last_name')" src="../assets/svg/valid-input.svg" alt="">
              <span class="payment-error-msg" v-show="errors.has('last_name') && errors.items[0].rule === 'required'">Please enter your last name.</span>
              <span class="payment-error-msg" v-show=" errors.has('last_name') && errors.items[0].rule === 'regex'">The name field may only contain alphabetic characters.</span>
            </div>
            <input type="hidden" name="ccFirstName" value="">
            <input type="hidden" name="ccLastName" value="">
          </div>

          <div class="input-row auto foo-validate">
            <div class="input-div input-icon">
              <label>Email</label>
              <br>
              <input type="email" name="email" placeholder="" value="" v-validate="'required|email'" maxlength="100" >
              <img class="validate-icon" v-if="errors.has('email')" src="../assets/svg/invalid-input.svg" alt="">
              <img class="validate-icon valid-icon" v-if="!errors.has('email')" src="../assets/svg/valid-input.svg" alt="">
              <span class="payment-error-msg" v-show="errors.has('email') && errors.items[0].rule === 'required'">Please enter your email address.</span>
              <span class="payment-error-msg" v-show=" errors.has('email') && errors.items[0].rule === 'email'">The email field must be a valid email.</span>
            </div>
            <div class="input-div input-icon">
              <label>Phone</label>
              <br>
              <input type="number" id="thePhone" pattern="\d*" class="cc" name="phone_number" onKeyPress="if(this.value.length==14) return false;"  placeholder="" v-validate="{ required: true, min: 7, integer: true}"
                value=""
              >
              <img class="validate-icon" v-if="errors.has('phone_number')" src="../assets/svg/invalid-input.svg" alt="">
              <img class="validate-icon valid-icon"  v-if="!errors.has('phone_number')" src="../assets/svg/valid-input.svg" alt="">
              <span class="payment-error-msg" v-show="errors.has('phone_number') && errors.items[0].rule === 'required'">Please enter a valid phone number.</span>
              <span class="payment-error-msg" v-show=" errors.has('phone_number') && errors.items[0].rule === 'integer'">The phone field may only contain numeric characters.</span>
              <span class="payment-error-msg" v-show=" errors.has('phone_number') && errors.items[0].rule === 'min'">Enter at least 7 digits</span>
            </div>
            <input type="hidden" name="ccFirstName" value="">
            <input type="hidden" name="ccLastName" value="">
          </div>

        <div class="groupon">
          <h4 class="input-row-heading">
            <br>
            <img class="payment-icon" src="../assets/svg/payment-icon.svg" alt="">
            <br>
            Payment information
            <br>
            <br>
            <img src="../assets/img/credit-card-logos-horizontal.png" alt="Accepted credit cards" style="display:inline-block;display: inline-block;vertical-align: middle;opacity: .4;">
          </h4>

          <div class="input-row foo-validate auto">
            <div class="input-div input-icon">
              <label>Card number</label>
              <br>
              <input type="number" pattern="\d*" id="ccno" autocomplete="off" class="cc cc-num" name="ccNo" placeholder="" v-validate="{ required: true, min: 12, max:19, integer: true}">
              <img class="validate-icon payment-error-icon-ccno" v-if="errors.has('ccNo')" src="../assets/svg/invalid-input.svg" alt="">
              <img class="validate-icon valid-icon payment-error-icon-ccno-valid"  v-if="!errors.has('ccNo')" src="../assets/svg/valid-input.svg" alt="">
              <span class="payment-error-msg payment-error-msg-ccno-a" v-show="errors.has('ccNo') && errors.items[0].rule === 'required' || errors.has('ccNo') && errors.items[0].rule === 'min'">Please enter a valid card number.</span>
              <span class="payment-error-msg" v-show=" errors.has('ccNo') && errors.items[0].rule === 'integer'">Your card number may only contain numeric characters.</span>
              <!-- <span class="payment-error-msg payment-error-msg-ccno" v-show=" errors.has('ccNo') && errors.items[0].rule === 'min'">Please enter a valid card number.</span> -->
              <span class="payment-error-msg" v-show=" errors.has('ccNo') && errors.items[0].rule === 'max'">Please enter a valid card number.</span>
            </div>
          </div>

          <div class="input-row foo-validate auto collapse">
            <div class="input-div input-icon">
              <label>Expiry month</label>
              <br>
              <select name="ccMonth" class="single-select" data-placeholder="" v-validate="'required'">
                <option></option>
                <option
                  v-for="index in 12"
                  v-bind:key="index"
                  :value="getMonth(index)"
                >
                {{ getMonth(index) }}
                </option>
              </select>
              <img class="validate-icon validate-icon-dropdown validate-icon-dropdown-month" v-if="errors.has('ccMonth')" src="../assets/svg/invalid-input.svg" alt="">
              <img class="validate-icon valid-icon validate-icon-dropdown validate-icon-dropdown-month-valid"  v-if="!errors.has('ccMonth')" src="../assets/svg/valid-input.svg" alt="">
              <span class="payment-error-msg payment-error-msg-month" v-show="errors.has('ccMonth')">Please select the expiry month on your card.</span>
            </div>
            <div class="input-div input-icon">
              <label>Expiry year</label>
              <br>
              <select name="ccYear" class="single-select" data-placeholder="" v-validate="'required'">
                <option></option>
                <option
                  v-for="index in 20"
                  v-bind:key="index"
                  :value="getYear(index)"
                >
                {{ getYear(index) }}
                </option>
              </select>
              <img class="validate-icon validate-icon-dropdown validate-icon-dropdown-year" v-if="errors.has('ccYear')" src="../assets/svg/invalid-input.svg" alt="">
              <img class="validate-icon validate-icon-dropdown validate-icon-dropdown-year-exprired" style="display:none;" src="../assets/svg/invalid-input.svg" alt="">
              <img class="validate-icon valid-icon validate-icon-dropdown validate-icon-dropdown-year-valid"  v-if="!errors.has('ccYear')" src="../assets/svg/valid-input.svg" alt="">
              <span class="payment-error-msg payment-error-msg-year" v-show="errors.has('ccYear')">Please select the expiry year on your card.</span>
              <span class="payment-error-msg payment-error-msg-month expired-card" style="display:none;">Please enter a valid expiry date.</span>
            </div>
            <div class="input-div input-icon">
              <label>CVV</label>
              <br>
              <input type="number" pattern="\d*" id="theCcv" autocomplete="off" class="cc" name="ccCCV"  placeholder="" maxlength="4"  v-validate="{ required: true, min: 3, integer: true}" >
              <img class="validate-icon" v-if="errors.has('ccCCV')" src="../assets/svg/invalid-input.svg" alt="">
              <img class="validate-icon valid-icon"  v-if="!errors.has('ccCCV')" src="../assets/svg/valid-input.svg" alt="">
              <span class="payment-error-msg" v-show="errors.has('ccCCV') && errors.items[0].rule === 'required'">Please enter the 3 digit security code on the back of your card.</span>
              <span class="payment-error-msg" v-show=" errors.has('ccCCV') && errors.items[0].rule === 'integer'">The CVV field may only contain numeric characters.</span>
              <span class="payment-error-msg" v-show=" errors.has('ccCCV') && errors.items[0].rule === 'min'">Enter at least 3 digits</span>
              <i class="icon icon-cvv"></i>
            </div>
          </div>

          <h4 class="input-row-heading">
            <img class="contact-information-icon" v-b-toggle.accordion3 src="../assets/svg/billing-address-icon.svg" alt="">
            <br>
            Billing address
            <br>
          </h4>

          <div class="input-div input-icon foo-validate">
              <label>Address</label>
              <br>
              <input type="text" name="street_address" placeholder=""
                maxlength="30"
                value=""
                v-validate="'required'"
              >
              <img class="validate-icon" v-if="errors.has('street_address')" src="../assets/svg/invalid-input.svg" alt="">
              <img class="validate-icon valid-icon"  v-if="!errors.has('street_address')" src="../assets/svg/valid-input.svg" alt="">
              <span class="payment-error-msg" v-show="errors.has('street_address')">Please enter your address.</span>
          </div>
          <br>
          <div class="input-row collapse auto">
            <div class="input-div input-icon foo-validate">
              <label>Country</label>
              <br>
              <select name="country" id="" class="single-select single-select-country" data-placeholder="" v-validate="'required'">
                <option></option>
                <option
                  v-for="(country, index) in countries"
                  v-bind:key="index"
                  :value="country"
                >
                  {{ country }}
                </option>
              </select>
              <img class="validate-icon validate-icon-dropdown validate-icon-dropdown-country" v-if="errors.has('country')" src="../assets/svg/invalid-input.svg" alt="">
              <img class="validate-icon valid-icon validate-icon-dropdown validate-icon-dropdown-country-valid"  src="../assets/svg/valid-input.svg" alt="">
              <span class="payment-error-msg payment-error-msg-country" v-show="errors.has('country')">Please enter your Country</span>
            </div>
            <div class="input-div input-icon foo-validate">
              <label>ZIP</label>
              <br>
              <input type="text" class="cc" name="zip" placeholder="" value="" v-validate="'required'">
              <img class="validate-icon" v-if="errors.has('zip') && usa" src="../assets/svg/invalid-input.svg" alt="">
              <img class="validate-icon valid-icon"  v-if="!errors.has('zip')" src="../assets/svg/valid-input.svg" alt="">
              <span class="payment-error-msg" v-show="errors.has('zip') && errors.items[0].rule === 'required' && usa">Please enter your zip code/postcode.</span>
              <span class="payment-error-msg" v-show="errors.has('zip') && errors.items[0].rule === 'integer' && usa">The zip code/postcode field may only contain numeric characters.</span>
            </div>
          </div>

          <div class="input-row collapse auto">
            <div class="input-div input-icon foo-validate">
              <label>State</label>
              <br>
              <select name="state" id="state_select" class="single-select single-select-state" v-validate="'required'">
              <option
                v-for="(state, index) in states"
                v-bind:key="index"
                :value="state"
              >
                {{ state }}
              </option>
              </select>
              <img class="validate-icon validate-icon-dropdown validate-icon-dropdown-state" v-if="errors.has('state') && usa" src="../assets/svg/invalid-input.svg" alt="">
              <img class="validate-icon valid-icon validate-icon-dropdown validate-icon-dropdown-state-valid"  v-if="!errors.has('state')" src="../assets/svg/valid-input.svg" alt="">
              <span class="payment-error-msg payment-error-msg-state" v-show="errors.has('state') && usa">Please enter your state</span>
            </div>
            <div class="input-div input-icon foo-validate">
              <label>City</label>
              <input type="text" name="city" placeholder="" value="" v-validate="'required'" maxlength="20">
              <img class="validate-icon" v-if="errors.has('city')" src="../assets/svg/invalid-input.svg" alt="">
              <img class="validate-icon valid-icon"  v-if="!errors.has('city')" src="../assets/svg/valid-input.svg" alt="">
              <span class="payment-error-msg" v-show="errors.has('city')">Please enter your city.</span>
            </div>
          </div>
        </div>
          <div class="checkbox-center">
            <div class="css-checkbox compare-cb green-cb">
              <input type="checkbox" id="ccb_02">
              <label for="ccb_02">I want to receive exclusive offers, promotions and travel tips from Walks.</label>
            </div>
            <div class="css-checkbox compare-cb green-cb">
              <input type="checkbox" id="ccb_01">
              <label for="ccb_01">I have read and agree to the <u class="terms-conditions">Terms & Conditions</u></label>
            </div>
          </div>
          <div class="center-btn medium">
            <div class="error-message error-message-booking">Invalid something.</div>
            <button class="btn primary complete_booking"  @click="completeBooking">Pay now</button>
          </div>
        </form>
      </div>
    </div>
    <div class="complete-footer">
      <h2 class="heading payment-heading payment-heading-footer">Total</h2>
      <span class="footer-total">{{ getTotalPrice(currencyData) }}</span>
    </div>
  </main>
</template>

<script>

import $ from 'jquery'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import store from '../store'
import VeeValidate from 'vee-validate'
import TermsPageModal from '@/pages/TermsPageModal'

require('@/lib/jquery.plugin.js')

Vue.use(VeeValidate)

export default {
  name: 'PaymentPage',
  components: {
    TermsPageModal
  },
  computed: {
    ...mapGetters([
      'currency',
      'status',
      'initValues',
      'carts',
      'discounts'
    ])
  },
  metaInfo () {
    return {
      title: 'Payment',
      meta: [
        {
          'property': 'og:title',
          'content': 'Payment'
        },
        {
          'property': 'og:description',
          'content': 'Payment'
        },
        {
          'property': 'og:type',
          'content': 'article'
        },
        {
          'property': 'og:url',
          'content': this.getMetaURL()
        },
        {
          'property': 'fb:app_id',
          'content': 1989124628036695
        },
        {
          vmid: 'description',
          name: 'description',
          content: 'Payment'
        }
      ],
      link: [
        { 'rel': 'canonical',
          'href': this.getMetaURL()
        }
      ]
    }
  },
  mounted () {
    if (process.env.PROMOCODE !== undefined) {
      this.applySpecialPromo()
    }
    $('#launcher').removeClass('launcher-detail')
    if (Vue.localStorage.get('Carts')) {
      var cart = JSON.parse(Vue.localStorage.get('Carts'))
      for (var ind in cart) {
        for (var i in cart[ind].guests) {
          if (cart[ind].guests[i].type === 'adults') {
            var adult = cart[ind].guests[i].count
          }
          if (cart[ind].guests[i].type === 'infants') {
            var infant = cart[ind].guests[i].count
          }
          if (cart[ind].guests[i].type === 'children') {
            var child = cart[ind].guests[i].count
          }
          if (cart[ind].guests[i].type === 'students') {
            var student = cart[ind].guests[i].count
          }
        }
        if (window._didAsyncInjectGoogleAnalytics) {
          window.dataLayer.push({
            'event': 'floodlightCheckout',
            'titleShort': cart[ind].name,
            'cityName': cart[ind].city,
            'dateTime': cart[ind].date,
            'adults': (adult !== undefined) ? adult : '0',
            'children': (child !== undefined) ? child : '0',
            'infants': (infant !== undefined) ? infant : '0',
            'students': (student !== undefined) ? student : '0'
          })
        }
      }
    }
    this.backToTop()
    if ($.fn.select2) {
      $('.single-select').select2({
        minimumResultsForSearch: -1
      })
      $('.single-select-country, .single-select-state').select2({
        minimumResultsForSearch: 1
      })
      $.fn.select2.amd.require(['select2/compat/matcher'], function (oldMatcher) {
        $('.single-select-country, .single-select-state').select2({
          matcher: oldMatcher(matchStart)
        })
      })
    }
    function matchStart (term, text) {
      console.log(text.toUpperCase())
      if (text.toUpperCase().replace(/\s/g, '').indexOf(term.toUpperCase()) === 0) {
        return true
      }
      return false
    }
    $('.terms-conditions').on('click ', function (e) {
      $('#myModal2').show()
      $('body').css('overflow', 'hidden')
    })

    $('.close, #myModal2').click(function () {
      $('#myModal2').hide()
      $('body').css('overflow', 'auto')
    })
    if (window._didAsyncInjectGoogleAnalytics) {
      window.dataLayer.push({
        'event': 'EC',
        'ecommerce': {
          'checkout': {
            'actionField': { 'step': 1 }
          }
        }
      })
    }
    $('html, body').animate({scrollTop: 0}, 400)

    $('.currency-nav').find('[data-currency=' + this.currency + ']').addClass('active')
    $('.currency-toggler').on('click', function () {
      self.setCurrency($(this).attr('data-currency'))
    })
    this.getPromoType()
    this.items = []
    this.currentCurrency = this.currency
    this.itemContainer = $('.payment-item-container', $('main.payment'))
    this.total = $('.price', $('main.payment'))
    this.currencyTogglers = $('.currency-togglers .buttons', $('main.payment'))
    this.country = $('[name=country]', $('main.payment'))
    this.state_select = $('#state_select', $('main.payment'))
    this.state_text = $('#state_text', $('main.payment'))
    this.iataContainer = $('.sidebar-payment-item.sidebar-iata')
    this.errorMessage = $('#formPayment', $('main.payment')).find('.error-message')
    this.submitButton = $('#formPayment', $('main.payment')).find('.center-btn .primary')
    this.formPayment = $('#formPayment', $('main.payment'))
    this.completeBookingCompleted = true
    this.checkCartEmpty()

    var self = this

    this.country.on('change', function (event) {
      if ($('[name=country]', $('main.payment')).val() !== '') {
        $('.validate-icon-dropdown-country-valid').attr('style', 'display: block !important')
        $('.payment-error-msg-country').hide()
        $('.validate-icon-dropdown-country').hide()
      }
    })
    this.state_select.on('change', function (event) {
      if ($('#state_select', $('main.payment')).val() !== '') {
        $('.validate-icon-dropdown-state-valid').attr('style', 'display: block !important')
        $('.payment-error-msg-state').hide()
        $('.validate-icon-dropdown-state').hide()
      }
    })
    $('[name=ccMonth]', $('main.payment')).on('change', function (event) {
      if ($('[name=ccMonth]', $('main.payment')).val() !== '') {
        $('.validate-icon-dropdown-month-valid').attr('style', 'display: block !important')
        $('.payment-error-msg-month').hide()
        $('.validate-icon-dropdown-month').hide()
      }
    })
    $('[name=ccYear]', $('main.payment')).on('change', function (event) {
      if ($('[name=ccYear]', $('main.payment')).val() !== '') {
        $('.validate-icon-dropdown-year-valid').attr('style', 'display: block !important')
        $('.payment-error-msg-year').hide()
        $('.validate-icon-dropdown-year').hide()
      }
    })
    $('[name=ccMonth]', $('main.payment')).on('change', function (event) {
      if (($('[name=ccMonth]', $('main.payment')).val() <= new Date().getMonth() && $('[name=ccYear]', $('main.payment')).val() <= new Date().getFullYear()) || $('[name=ccYear]', $('main.payment')).val() === '') {
        $('.expired-card').show()
        $('.validate-icon-dropdown-year-valid').attr('style', 'display: none !important')
        $('.validate-icon-dropdown-year-exprired').show()
      } else {
        $('.expired-card').hide()
        $('.validate-icon-dropdown-year-exprired').hide()
        $('.validate-icon-dropdown-year-valid').attr('style', 'display: block !important')
      }
    })
    $('[name=ccYear]', $('main.payment')).on('change', function (event) {
      if ($('[name=ccMonth]', $('main.payment')).val() < new Date().getMonth() && $('[name=ccYear]', $('main.payment')).val() <= new Date().getFullYear()) {
        $('.expired-card').show()
        $('.validate-icon-dropdown-year-valid').attr('style', 'display: none !important')
        $('.validate-icon-dropdown-year-exprired').show()
      } else {
        $('.expired-card').hide()
        $('.validate-icon-dropdown-year-exprired').hide()
        $('.validate-icon-dropdown-year-valid').attr('style', 'display: block !important')
      }
    })

    this.country.on('change', function (event) {
      if ($('[name=country]', $('main.payment')).val() !== 'United States of America') {
        $('#state_select').val('')
        $('#state_select').prop('disabled', true)
        self.state_select.val('').removeAttr('name').removeAttr('required')

        self.state_text.parent().show()
        self.state_text.attr('name', 'state').attr('required', 'required')
        self.usa = false
      } else {
        $('#state_select').prop('disabled', false)
        self.usa = true
        var txtVal = self.state_text.val()
        self.state_text.parent().hide()
        self.state_text.val('').removeAttr('name').removeAttr('required')

        self.state_select.val(txtVal)
        self.state_select.parent().show()
        self.state_select.attr('name', 'state').attr('required', 'required')
        self.state_select.trigger('change')
      }
    })
    this.country.trigger('change')
    this.iataContainer.find('form').submit(this.addIataNumber)
    this.iataContainer.on('click', '.clear-input', this.clearIataNumber)

    this.currencyTogglers.on('click', '.currency-toggler', function () {
      self.currencyData = $(this).attr('data-currency')
      self.setCurrency($(this).attr('data-currency'))
    })

    $('.promo-code').click(function (event) {
      event.preventDefault()
      $(this).parents('.sidebar-payment-item').find('div').parent().toggleClass('active')
      $(this).toggleClass('active')
      $(this).hide()
    })

    $('form').submit(function (e) {
      e.preventDefault()
    })

    this.$store.watch(() => this.$store.getters.currency, (newCurrency, oldCurrency) => {
      self.currencyData = newCurrency
      self.setCurrency(newCurrency)
    })
    this.adaptIATA()

    if (this.promoType === 'fixed' || this.promoType === 'percentage') {
      $('.promo-code-applied').show()
      $('.promocode-input').hide()
      $('.promo-error-message').hide()
      $('.promo-code-promo').hide()
    }

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
        $('html, body').animate({
          scrollTop: $('.right-book').offset().top
        }, 400)
      } else {
        $('html, body').animate({
          scrollTop: 0
        }, 400)
      }
    })
    // $('[name=first_name]').keypress(function (e) {
    //   var regex = new RegExp(^[A-Za-z -]+$);
    //   var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    //   if (regex.test(str)) {
    //       return true;
    //   }

    //   e.preventDefault();
    //   return false;
    // })
    $(document).ready(function () {
      $('#ccno, #theCcv, #thePhone').keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 || (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || (e.keyCode >= 35 && e.keyCode <= 40)) {
          // let it happen, don't do anything
          return
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault()
        }
      })
      var viewBasketCriteo = []
      if (Vue.localStorage.get('Carts')) {
        var cart = JSON.parse(Vue.localStorage.get('Carts'))
        for (var ind in cart) {
          // criteo
          viewBasketCriteo.push({
            'id': cart[ind].eventID,
            'price': parseFloat(self.getSubTotal(self.carts[ind], Vue.localStorage.get('defaultCurrency')).substring(1)),
            'quantity': 1
          })
        }
      }
      if (window._didAsyncInjectGoogleAnalytics) {
        window.dataLayer.push({
          'event': 'CriteoCheckout',
          'PageType': 'BasketPage',
          'setAccount': Vue.localStorage.get('CriteoID'),
          'setSiteType': Vue.localStorage.get('deviceType'),
          'setHashedEmail': [''],
          'viewListPayment': viewBasketCriteo
        })
      }
    })
    // // Limit credit card input field to digits only
    // let ccnoInput = document.getElementById('ccno')
    // ccnoInput.addEventListener('keypress', function (e) {
    //   if ((e.which !== 8 && e.which !== 0 && e.which < 48) || e.which > 57) {
    //     e.preventDefault()
    //   }
    // })
    // let ccvInput = document.getElementById('theCcv')
    // ccvInput.addEventListener('keypress', function (e) {
    //   if ((e.which !== 8 && e.which !== 0 && e.which < 48) || e.which > 57) {
    //     e.preventDefault()
    //   }
    // })

    document.dispatchEvent(new Event('render-event'))
    console.log(cart[ind].date)
    // disable mousewheel on a input number field when in focus
    // (to prevent Cromium browsers change the value when scrolling)
    $('#formPayment').on('focus', 'input[type=number]', function (e) {
      $(this).on('mousewheel.disableScroll', function (e) {
        e.preventDefault()
      })
    })
    $('#formPayment').on('blur', 'input[type=number]', function (e) {
      $(this).off('mousewheel.disableScroll')
    })
  },
  elem: null,
  items: [],
  itemContainer: null,
  total: null,
  currencyTogglers: null,
  country: null,
  state_select: null,
  state_text: null,
  iataContainer: null,
  errorMessage: null,
  submitButton: null,
  formPayment: null,
  currentCurrency: '',
  watch: {
    currencyData: function (newData, oldData) {
      console.log(newData + ' ' + oldData)
    }
  },
  methods: {
    parseDate (str) {
      console.log(str)
      var mdy = str.split('/')
      return new Date(mdy[2], mdy[0] - 1, mdy[1])
    },

    datediff (first, second) {
      // Take the difference between the dates and divide by milliseconds per day.
      // Round to nearest whole number to deal with DST.
      return Math.round((second - first) / (1000 * 60 * 60 * 24))
    },
    getMetaURL () {
      let trailingSlash = ''
      if (!this.$route.path.match(/\/$/)) {
        trailingSlash = '/'
      }
      return Vue.url.options.root + this.$route.path + trailingSlash
    },
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
    setCurrency (newcurrency) {
      $('.currency-nav').find('.active').removeClass('active')
      this.$store.commit('setCurrency', newcurrency)
      $('.currency-nav').find('[data-currency=' + this.currency + ']').addClass('active')
    },
    getEventDate (item) {
      return item.date
    },
    getEventName (item) {
      return item.name
    },
    getPrice (item, guest, currency) {
      var realPrice = this.convertPrice(item, guest, currency)
      return this.convertFormatPrice(realPrice, currency)
    },
    getSubTotal (item, currency) {
      var subTotal = 0
      for (var index in item.guests) {
        var guest = item.guests[index]
        subTotal += this.convertPrice(item, guest, currency)
      }
      if (this.discounts.length > 0 && this.promoType === 'percentage') {
        subTotal -= this.getDiscountSumPriceValue(item, currency)
      }
      return this.convertFormatPrice(subTotal, currency)
    },
    getTotalPrice (currency) {
      var total = 0
      for (var ind in this.carts) {
        var item = this.carts[ind]
        console.log('item')
        console.log(item)
        var subTotal = 0
        for (var index in item.guests) {
          var guest = item.guests[index]
          subTotal += this.convertPrice(item, guest, currency)
          console.log(subTotal)
        }
        total += subTotal
        if (this.promoType === 'percentage') {
          total -= this.getDiscountSumPriceValue(item, currency)
          console.log(total)
        }
      }

      if (this.discounts.length > 0) {
        if (this.promoType === 'fixed') {
          total -= this.getDiscountAmount()
          console.log(total)
        }
      }
      console.log('after discount')
      console.log(this.carts)
      if (total === 0) {
        $('.groupon').hide()
        this.free = 1
      }
      if (this.carts.length > 0) {
        return this.convertFormatPrice(total, currency)
      } else {
        return 'FREE'
      }
    },
    getMonth (month) {
      return month >= 10 ? month.toString() : '0' + month.toString()
    },
    getYear (year) {
      return (year + 2018).toString()
    },
    getPromoType () {
      for (var index in this.discounts) {
        var discount = this.discounts[index]
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
    showDiscountInItem (item) {
      if (this.promoType === 'percentage' && this.discounts.length > 0 && this.getDiscountPercent(item) > 0) {
        return true
      } else {
        return false
      }
    },
    getDiscountPercent (item) {
      for (var index in this.discounts) {
        var discount = this.discounts[index]
        if (this.promoType === 'percentage' && discount.stage_id.toString() === item.staging_id.toString()) {
          var currencyExchange = discount.currency_exchange[0]
          var percent = (currencyExchange.amount_full_price - currencyExchange.amount) / currencyExchange.amount_full_price
          return Math.round(percent * 100)
        }
      }
      return 0
    },
    getDiscountAmount () {
      if (this.promoType === 'fixed') {
        console.log('getDiscountAmount')
        console.log(this.totalFixedPromoDiscountAmount[this.currency])
        return this.totalFixedPromoDiscountAmount[this.currency]
      }
    },
    getDiscountSumPrice (item, currency) {
      var subTotal = this.getDiscountSumPriceValue(item, currency)
      return this.convertFormatPrice(subTotal, currency)
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
    checkCartEmpty () {
      if (this.isCartEmpty()) {
        var self = this
        this.submitButton.removeClass('green')
        this.submitButton.click(function (e) {
          e.preventDefault()
          self.showError('Your cart is empty.')
        })
      }
    },
    formSubmit () {
      this.errorMessage.hide()
      $('main.payment').find('[name=ccFirstName]').val(this.getVal('first_name'))
      $('main.payment').find('[name=ccLastName]').val(this.getVal('last_name'))

      // check credit card number
      var ccNum = this.getVal('ccNo')
      if (ccNum.length !== 16 || (ccNum.length === 16 && !this.luhnCheck(ccNum))) {
        this.showError('Please check your credit card number')
        return false
      }
      if (!$('#ccb_01').prop('checked')) {
        this.showError('Please indicate that you have read and agree to the Terms & Conditions by ticking the box above.')
        return false
      }

      $('.complete_booking').prop('disabled', true)
      return true
    },
    showError (message) {
      this.errorMessage.html(message).fadeIn(200)
    },
    getVal (name) {
      return $('main.payment').find('[name=' + name + ']').val()
    },
    luhnCheck (val) {
      var sum = 0
      for (var i = 0; i < val.length; i++) {
        var intVal = parseInt(val.substr(i, 1))
        if (i % 2 === 0) {
          intVal *= 2
          if (intVal > 9) {
            intVal = 1 + (intVal % 10)
          }
        }
        sum += intVal
      }
      return (sum % 10) === 0
    },
    convertPrice (item, guest, currency) {
      var price = 0

      if (guest === undefined) {
        return price
      }
      console.log(item)
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
    isCartEmpty () {
      return this.carts.length === 0
    },
    addIataNumber (e) {
      e.preventDefault()
      $('main.payment').find('[name=iata]').val(this.iataContainer.find('input[name=iata-input]').val())
    },
    clearIataNumber () {
      $('main.payment').find('[name=iata]').val('')
    },
    removeFromCart (item, index) {
      this.$store.dispatch('removeCart', item)
      this.removeFromCartCanceled(index)
    },
    removeFromCartWarning (index) {
      $('.payment-widget-close').hide()
      $('.remove-cart-wrapper-' + index).show()
      $('.payment-event-date-' + index).hide()
      $('.checkout-summary-' + index).hide()
    },
    removeFromCartCanceled (index) {
      $('.payment-widget-close').show()
      $('.remove-cart-wrapper-' + index).hide()
      $('.payment-event-date-' + index).show()
      $('.checkout-summary-' + index).show()
    },
    applyIATA (event) {
      console.log('apply IATA code')
      var $wrap = $('.iata-input')
      var $input = $wrap.find('input')
      var iataCode = $input.val()
      console.log('IATA Code - ' + iataCode)
    },
    applyPromo (event) {
      console.log('apply promo code')
      $('.promo-error-message').hide()
      var $wrap = $('.promocode-input')
      var $input = $wrap.find('input')
      var promoCode = $input.val()
      var self = this
      // if (this.initValues.discount === '0') {
      //   // this.$store.commit('setStatus', {
      //   //   type: 'error',
      //   //   message: 'Promo is not available for this cart'
      //   // })
      // } else {
      //   if (promoCode) {
      store.dispatch('applyPromo', promoCode).then((data) => {
        console.log('Apply Promo Success')
        // self.showErrorPromo = false
        self.showCautionPromo = false
        self.showValidPromo = false
        self.bShowDiscount = true
        $input.val('')
        self.getPromoType()
        self.$forceUpdate()
      }, error => {
        $input.val('')
        // $('.promo-error-message').html(error)
        // $('.promo-error-message').show()
        console.log('Apply Promo Failed' + error)
        // this.$store.commit('setStatus', {
        //   type: 'error',
        //   message: error.message
        // })
        // self.showErrorPromo = true
        self.showCautionPromo = false
        self.showValidPromo = false
        self.bShowDiscount = false
        self.$forceUpdate()
      })
        // }
      // }
    },
    applySpecialPromo (event) {
      console.log('apply promo code')
      $('.promo-error-message').hide()
      var $wrap = $('.promocode-input')
      var $input = $wrap.find('input')
      var promoCode = process.env.PROMOCODE
      var self = this
      // if (this.initValues.discount === '0') {
      //   // this.$store.commit('setStatus', {
      //   //   type: 'error',
      //   //   message: 'Promo is not available for this cart'
      //   // })
      // } else {
      //   if (promoCode) {
      store.dispatch('applyPromo', promoCode).then((data) => {
        console.log('Apply Promo Success')
        // self.showErrorPromo = false
        self.showCautionPromo = false
        self.showValidPromo = false
        self.bShowDiscount = true
        $input.val('')
        self.getPromoType()
        self.$forceUpdate()
      }, error => {
        $input.val('')
        // $('.promo-error-message').html(error)
        // $('.promo-error-message').show()
        console.log('Apply Promo Failed' + error)
        // this.$store.commit('setStatus', {
        //   type: 'error',
        //   message: error.message
        // })
        // self.showErrorPromo = true
        self.showCautionPromo = false
        self.showValidPromo = false
        self.bShowDiscount = false
        self.$forceUpdate()
      })
        // }
      // }
    },
    completeBooking (event) {
      if (this.completeBookingCompleted) {
        // Disable submit Button
        $('.complete_booking').prop('disabled', true)
        // Saving form inputs into variables
        var firstName = $('[name=first_name]').val()
        var lastName = $('[name=last_name]').val()
        var email = $('[name=email]').val()
        var phone = $('[name=phone_number]').val()
        var ccNo = $('[name=ccNo]').val()
        var ccMonth = $('[name=ccMonth]').val()
        var ccYear = $('[name=ccYear]').val()
        var ccCCV = $('[name=ccCCV]').val()
        var street = $('[name=street_address]').val()
        var country = $('[name=country]').val()
        var city = $('[name=city]').val()
        var zip = $('[name=zip]').val()
        var state = $('#state_select').val()
        var iataCode = $('.iata-input').find('input').val()
        var self = this
        // this.free is true if a 100% discount promo code is applied
        // payload for the booking finalize end point
        if (this.free) {
          var cardInfo = {
            perform_charge: '0',
            currency_code: this.currency,
            cc_type: this.getCCType(ccNo),
            // cc_type: 'VI',
            cc_number: ccNo,
            cc_month: ccMonth,
            cc_year: ccYear,
            cc_cvv: ccCCV,
            sales_channel: 'takewalks'
          }
        } else {
          cardInfo = {
            perform_charge: '1',
            currency_code: this.currency,
            cc_type: this.getCCType(ccNo),
            // cc_type: 'VI',
            cc_number: ccNo,
            cc_month: ccMonth,
            cc_year: ccYear,
            cc_cvv: ccCCV,
            sales_channel: 'takewalks'
          }
        }
        // Clear Credit card input field
        $('.cc-num').val('')
        // payload for the booking initialize end point
        var initInfo = {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          address: street,
          city: city,
          state: (state === null ? 'NA' : state),
          zip: zip,
          zero_amount: this.free,
          country_code: this.getCountryCode(country),
          currency_code: this.currency,
          agent_iatta: iataCode
        }
        // Make sure that the form doesn`t have any errors
        this.$validator.validateAll().then((result) => {
          if ($('[name=ccMonth]', $('main.payment')).val() !== '' && $('[name=ccYear]', $('main.payment')).val() !== '' && $('[name=ccMonth]', $('main.payment')).val() <= new Date().getMonth() && $('[name=ccYear]', $('main.payment')).val() <= new Date().getFullYear()) {
            $('html, body').animate({scrollTop: 0}, 400)
            $('.complete_booking').prop('disabled', false)
            return
          }
          if (!$('#ccb_01').prop('checked')) {
            this.showError('Please indicate that you have read and agree to the Terms & Conditions by ticking the box above.')
            if (!result) {
              $('html, body').animate({scrollTop: 0}, 400)
              $('.complete_booking').prop('disabled', false)
              return
            }
            $('.complete_booking').prop('disabled', false)
            return
          }
          this.completeBookingCompleted = false
          // Dispatch payload to initializeBooking end point
          this.$store.dispatch('initializeBooking', initInfo).then((expired) => {
            console.log('Success Initialize Booking')
            if (expired) {
              // send user a message that cart has expired
              $('.error-message-booking').html('Some items in your cart have expired. Please re-book any tours that have been removed.').stop(1, 1).fadeIn()
              if (Vue.localStorage.get('BookingID')) {
                // Calling checkReserved in order to remove expired items from the cart
                store.dispatch('checkReserved', Vue.localStorage.get('BookingID')).then(() => {
                })
              }
              this.completeBookingCompleted = true
              $('.complete_booking').prop('disabled', false)
              return
            }
            $('.complete_booking').prop('disabled', false)
            // Dispatch payload to finalizeBooking end point
            this.$store.dispatch('finalizeBooking', cardInfo).then(() => {
              // payload for the confirmation email end point
              var clientInfo = {
                booking_detail_ids: Vue.localStorage.get('BookingDetailIds').split(','),
                template_name: 'takewalks-booking-confirmation-email-english',
                email_address_override: email
              }
              var adult = '0'
              var infant = '0'
              var child = '0'
              var student = '0'
              // Send data to adestra
              if ($('#ccb_02').prop('checked')) {
                for (var ind in this.carts) {
                  for (let i in this.carts[ind].guests) {
                    if (this.carts[ind].guests[i].type === 'adults') {
                      adult = this.carts[ind].guests[i].count
                    }
                    if (this.carts[ind].guests[i].type === 'infants') {
                      infant = this.carts[ind].guests[i].count
                    }
                    if (this.carts[ind].guests[i].type === 'children') {
                      child = this.carts[ind].guests[i].count
                    }
                    if (this.carts[ind].guests[i].type === 'students') {
                      student = this.carts[ind].guests[i].count
                    }
                  }
                  let currentDate = new Date()
                  currentDate = (currentDate.getMonth() + 1) + '/' + currentDate.getDate() + '/' + currentDate.getFullYear()
                  let adestraInfo = {
                    email: clientInfo.email_address_override,
                    transaction_value: parseInt(this.getTotalPrice('USD').replace('$', '')),
                    transaction_ref: Vue.localStorage.get('BookingID'),
                    product_ref: Vue.localStorage.get('BookingDetailIds')[ind],
                    product_name: this.carts[ind].name,
                    transaction_product_value: parseInt(this.getSubTotal(this.carts[ind], 'USD').replace('$', '')),
                    transaction_timestamp: new Date(new Date().getTime()),
                    transaction_product_quantity: this.carts.length,
                    event_date_time: Vue.moment(this.carts[ind].adestraDate).format('MM-DD-YYYY') + 'T' + this.carts[ind].adestraTime + ':00Z',
                    days_between: this.datediff(this.parseDate(currentDate), this.parseDate(this.carts[ind].adestraDate)),
                    number_adults: (adult !== undefined) ? adult : '0',
                    number_students: (student !== undefined) ? student : '0',
                    number_children: (child !== undefined) ? child : '0',
                    number_infants: (child !== undefined) ? infant : '0',
                    number_seniors: '0',
                    city: this.carts[ind].city,
                    market: this.carts[ind].country,
                    stage_id: this.carts[ind].staging_id,
                    channel: 'TW',
                    opt_in: 'yes'
                  }
                  this.$store.dispatch('adestraTransaction', adestraInfo).then(() => {
                  }, error => {
                    console.log(error)
                  })
                }
              }
              $('.complete_booking').hide()
              // Dispatch payload to confirmationEmail end point
              this.$store.dispatch('confirmationEmail', clientInfo).then(() => {
                // Dispatch getCollateral end point in order to get the data on the confirmation page
                this.$store.dispatch('getCollateral').then(() => {
                  // Redirect the user to the confirmation page
                  self.$router.push({path: '/confirm'})
                }, error => {
                  // If there is an error with the confirmation email end point
                  this.showError('Your payment has been accepted but we are having issues sending your confirmation email. Please contact customer service')
                  console.log(error)
                })
              }, error => {
                // If there is an error with the getCollateral end point
                this.showError('Your payment has been accepted and your confirmation email has been sent but we are having some issues. Please contact customer service')
                console.log(error)
              })
            }, error => {
              $('.cc-num').val('')
              $('.cc-num').focus()
              $('.payment-error-msg-ccno-a').show()
              this.showError('Invalid credit card number, please enter again.')
              console.log('Error Finalize Booking ' + error)
            }).then(() => {
              this.completeBookingCompleted = true
              $('.complete_booking').prop('disabled', false)
            })
          }, error => {
            $('.cc-num').val('')
            $('html, body').animate({scrollTop: 0}, 400)
            // If booking intialize fails clear the credit card field and enable the booking button
            console.log('Error Initialize Booking ' + error)
            this.showError(error.message)
            $('.complete_booking').prop('disabled', false)
            this.completeBookingCompleted = true
            this.$store.commit('setStatus', {
              type: 'error',
              message: error.message
            })
          })
        })
      }
    },
    customValidity (value, field) {
      if (value.length === 0) {
        this.showError('Please fill out ' + field)
        return false
      }
      return true
    },
    getCCType (pan) {
      // var visaRegex = '/^4[0-9]{12}(?:[0-9]{3})?$/'
      // var vprecaRegex = '/^428485[0-9]{0,}$/'
      // var postepayRegex = '/^(402360|402361|403035|417631|529948){0,}$/'
      // var cartasiRegex = '/^(432917|432930|453998)[0-9]{0,}$/'
      // var entropayRegex = '/^(406742|410162|431380|459061|533844|522093)[0-9]{0,}$/'
      // var o2moneyRegex = '/^(422793|475743)[0-9]{0,}$/'
      // var mastercardRegex = '/^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/'
      // var maestroRegex = '/^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$/'
      // var kukuruzaRegex = '/^525477[0-9]{0,}$/'
      // var yunacardRegex = '/^541275[0-9]{0,}$/'
      // var amexRegex = '/^3[47][0-9]{13}$/'
      // var dinersRegex = '/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/'
      // var discoverRegex = '/^6(?:011|5[0-9]{2})[0-9]{12}$/'
      // var jcbRegex = '/^(?:3[0-9]{15}|(2131|1800)[0-9]{11})$/'

      if (pan.match(/^4[0-9]{12}(?:[0-9]{3})?$/)) {
        return 'VI'
      }

      if (pan.match(/^3[47]\d{13,14}$/)) {
        return 'AX'
      }
      if (pan.match(/^(?:2131|1800|35\d{3})\d{11}$/)) {
        return 'jcb'
      }

      if (pan.match(/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/)) {
        return 'diners_club'
      }

      if (pan.match(/^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/)) {
        return 'MC'
      }

      if (pan.match(/^6(?:011|5[0-9]{2})[0-9]{12}$/)) {
        return 'DI'
      }

      if (pan.match(/^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$/)) {
        if (pan[0] === '5') {
          return 'mastercard'
        } else {
          return 'maestro'
        }
      }

      return 'unknown'
    },
    preg_match (regex, card) {
      return card.match(regex)
    },
    adaptIATA () {
      var $wrap = $('.promocode-input,.iata-input')
      var $btn = $wrap.find('.btn')
      var $input = $wrap.find('input')
      var self = this
      // $('.promocode-input').find('.btn').click(function (e) {
      //   var $wrap = $(this).parents('.promocode-input')
      //   var $input = $wrap.find('input')
      //   if (!$input.val()) {
      //     $wrap.addClass('invalid').removeClass('valid')
      //     $wrap.find('.input-icon').addClass('invalid')
      //     $wrap.find('.icon-checkmark').remove()
      //     $(this).closest('.sidebar-promocode').find('.error-msg').show()
      //     self.showCautionPromo = true
      //     self.showValidPromo = false
      //     self.showErrorPromo = true
      //   } else {
      //     $wrap.removeClass('invalid').addClass('valid')
      //     $wrap.find('.input-icon').removeClass('invalid').addClass('valid')
      //     $wrap.find('.icon-attention').remove()
      //     // $(this).text('Applied')
      //     $(this).closest('.sidebar-promocode').find('.error-msg').hide()
      //     self.showCautionPromo = false
      //     self.showValidPromo = true
      //     self.showErrorPromo = false
      //   }
      // })

      $('.iata-input').find('.btn').click(function (e) {
        var $wrap = $(this).parents('.iata-input')
        var $input = $wrap.find('input')
        if (!$input.val()) {
          $wrap.addClass('invalid').removeClass('valid')
          $wrap.find('.input-icon').addClass('invalid')
          $wrap.find('.icon-checkmark').remove()
          $(this).closest('.sidebar-promocode').find('.error-msg').show()
          self.showCautionIATA = true
          self.showValidIATA = false
          self.showErrorIATA = true
        } else {
          $wrap.removeClass('invalid').addClass('valid')
          $wrap.find('.input-icon').removeClass('invalid').addClass('valid')
          $wrap.find('.icon-attention').remove()
          $(this).text('Applied')
          $(this).closest('.sidebar-promocode').find('.error-msg').hide()
          self.showCautionIATA = false
          self.showValidIATA = true
          self.showErrorIATA = false
        }
      })
      // $(document).on('focus', '.select2', function (e) {
      //   if (e.originalEvent) {
      //     $(this).siblings('select').select2('open')
      //   }
      // })
      $(document).on('click', '.clear-input-iata', function () {
        $(this).parent().find('input').val('')
        $wrap.removeClass('valid')
        $wrap.find('.input-icon').removeClass('valid')
        self.showValidIATA = false
        $btn.text('Apply')
        $(this).remove()
      })

      $(document).on('click', '.clear-input-promo', function () {
        $(this).parent().find('input').val('')
        $wrap.removeClass('valid')
        $wrap.find('.input-icon').removeClass('valid')
        self.showValidPromo = false
        $btn.text('Apply')
        $(this).remove()
      })

      $input.keyup(function () {
        $btn.addClass('green')
      })

      $input.blur(function () {
        if (!$(this).val().length) {
          $btn.removeClass('green')
        }
      })
    },
    getCountryCode (country) {
      var codes = [
        'US', 'IT', 'AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU',
        'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BA', 'BW', 'BV',
        'BR', 'IO', 'VG', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN',
        'CX', 'CC', 'CO', 'KM', 'CD', 'CG', 'CK', 'CR', 'CI', 'HR', 'CU', 'CY', 'CZ', 'DK', 'DJ', 'DM',
        'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FO', 'FK', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF',
        'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY',
        'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'JM', 'JP',
        'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI',
        'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX',
        'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'AN', 'NL', 'NC', 'NZ',
        'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH',
        'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC',
        'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'ES',
        'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO',
        'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'UM', 'VI', 'UY', 'UZ', 'VU', 'VE',
        'VN', 'WF', 'EH', 'YE', 'ZM', 'ZW'
      ]
      var index = this.countries.indexOf(country)
      return codes[index]
    }
  },
  data () {
    return {
      free: false,
      usa: false,
      currencyData: this.currency,
      showCautionPromo: false,
      showValidPromo: false,
      showErrorPromo: false,
      showCautionIATA: false,
      showValidIATA: false,
      showErrorIATA: false,
      bShowDiscount: false,
      promoType: '',
      fixedPromoAmount: 0,
      totalFixedPromoDiscountAmount: {},
      states: [
        'AL',
        'AK',
        'AZ',
        'AR',
        'CA',
        'CO',
        'CT',
        'DE',
        'FL',
        'GA',
        'HI',
        'ID',
        'IL',
        'IN',
        'IA',
        'KS',
        'KY',
        'LA',
        'ME',
        'MD',
        'MA',
        'MI',
        'MN',
        'MS',
        'MO',
        'MT',
        'NE',
        'NV',
        'NH',
        'NJ',
        'NM',
        'NY',
        'NC',
        'ND',
        'OH',
        'OR',
        'OK',
        'PA',
        'RI',
        'SC',
        'SD',
        'TN',
        'TX',
        'UT',
        'VT',
        'VA',
        'WA',
        'WV',
        'WI',
        'WY',
        'AS',
        'DC',
        'FM',
        'GU',
        'MH',
        'MP',
        'PW',
        'PR',
        'VI'
      ],
      countries: [
        'United States of America',
        'Italy',
        'Afghanistan',
        'Aland Islands',
        'Albania',
        'Algeria',
        'American Samoa',
        'Andorra',
        'Angola',
        'Anguilla',
        'Antarctica',
        'Antigua and Barbuda',
        'Argentina',
        'Armenia',
        'Aruba',
        'Australia',
        'Austria',
        'Azerbaijan',
        'Bahamas the',
        'Bahrain',
        'Bangladesh',
        'Barbados',
        'Belarus',
        'Belgium',
        'Belize',
        'Benin',
        'Bermuda',
        'Bhutan',
        'Bolivia',
        'Bosnia and Herzegovina',
        'Botswana',
        'Bouvet Island (Bouvetoya)',
        'Brazil',
        'British Indian Ocean Territory (Chagos Archipelago)',
        'British Virgin Islands',
        'Brunei Darussalam',
        'Bulgaria',
        'Burkina Faso',
        'Burundi',
        'Cambodia',
        'Cameroon',
        'Canada',
        'Cape Verde',
        'Cayman Islands',
        'Central African Republic',
        'Chad',
        'Chile',
        'China',
        'Christmas Island',
        'Cocos (Keeling) Islands',
        'Colombia',
        'Comoros the',
        'Congo',
        'Congo the',
        'Cook Islands',
        'Costa Rica',
        'Cote d\'Ivoire',
        'Croatia',
        'Cuba',
        'Cyprus',
        'Czech Republic',
        'Denmark',
        'Djibouti',
        'Dominica',
        'Dominican Republic',
        'Ecuador',
        'Egypt',
        'El Salvador',
        'Equatorial Guinea',
        'Eritrea',
        'Estonia',
        'Ethiopia',
        'Faroe Islands',
        'Falkland Islands (Malvinas)',
        'Fiji the Fiji Islands',
        'Finland',
        'France, French Republic',
        'French Guiana',
        'French Polynesia',
        'French Southern Territories',
        'Gabon',
        'Gambia the',
        'Georgia',
        'Germany',
        'Ghana',
        'Gibraltar',
        'Greece',
        'Greenland',
        'Grenada',
        'Guadeloupe',
        'Guam',
        'Guatemala',
        'Guernsey',
        'Guinea',
        'Guinea-Bissau',
        'Guyana',
        'Haiti',
        'Heard Island and McDonald Islands',
        'Holy See (Vatican City State)',
        'Honduras',
        'Hong Kong',
        'Hungary',
        'Iceland',
        'India',
        'Indonesia',
        'Iran',
        'Iraq',
        'Ireland',
        'Isle of Man',
        'Israel',
        'Jamaica',
        'Japan',
        'Jersey',
        'Jordan',
        'Kazakhstan',
        'Kenya',
        'Kiribati',
        'Korea',
        'Korea',
        'Kuwait',
        'Kyrgyz Republic',
        'Lao',
        'Latvia',
        'Lebanon',
        'Lesotho',
        'Liberia',
        'Libyan Arab Jamahiriya',
        'Liechtenstein',
        'Lithuania',
        'Luxembourg',
        'Macao',
        'Macedonia',
        'Madagascar',
        'Malawi',
        'Malaysia',
        'Maldives',
        'Mali',
        'Malta',
        'Marshall Islands',
        'Martinique',
        'Mauritania',
        'Mauritius',
        'Mayotte',
        'Mexico',
        'Micronesia',
        'Moldova',
        'Monaco',
        'Mongolia',
        'Montenegro',
        'Montserrat',
        'Morocco',
        'Mozambique',
        'Myanmar',
        'Namibia',
        'Nauru',
        'Nepal',
        'Netherlands Antilles',
        'Netherlands the',
        'New Caledonia',
        'New Zealand',
        'Nicaragua',
        'Niger',
        'Nigeria',
        'Niue',
        'Norfolk Island',
        'Northern Mariana Islands',
        'Norway',
        'Oman',
        'Pakistan',
        'Palau',
        'Palestinian Territory',
        'Panama',
        'Papua New Guinea',
        'Paraguay',
        'Peru',
        'Philippines',
        'Pitcairn Islands',
        'Poland',
        'Portugal, Portuguese Republic',
        'Puerto Rico',
        'Qatar',
        'Reunion',
        'Romania',
        'Russian Federation',
        'Rwanda',
        'Saint Barthelemy',
        'Saint Helena',
        'Saint Kitts and Nevis',
        'Saint Lucia',
        'Saint Martin',
        'Saint Pierre and Miquelon',
        'Saint Vincent and the Grenadines',
        'Samoa',
        'San Marino',
        'Sao Tome and Principe',
        'Saudi Arabia',
        'Senegal',
        'Serbia',
        'Seychelles',
        'Sierra Leone',
        'Singapore',
        'Slovakia (Slovak Republic)',
        'Slovenia',
        'Solomon Islands',
        'Somalia, Somali Republic',
        'South Africa',
        'South Georgia and the South Sandwich Islands',
        'Spain',
        'Sri Lanka',
        'Sudan',
        'Suriname',
        'Svalbard & Jan Mayen Islands',
        'Swaziland',
        'Sweden',
        'Switzerland, Swiss Confederation',
        'Syrian Arab Republic',
        'Taiwan',
        'Tajikistan',
        'Tanzania',
        'Thailand',
        'Timor-Leste',
        'Togo',
        'Tokelau',
        'Tonga',
        'Trinidad and Tobago',
        'Tunisia',
        'Turkey',
        'Turkmenistan',
        'Turks and Caicos Islands',
        'Tuvalu',
        'Uganda',
        'Ukraine',
        'United Arab Emirates',
        'United Kingdom',
        'United States Minor Outlying Islands',
        'United States Virgin Islands',
        'Uruguay, Eastern Republic of',
        'Uzbekistan',
        'Vanuatu',
        'Venezuela',
        'Vietnam',
        'Wallis and Futuna',
        'Western Sahara',
        'Yemen',
        'Zambia',
        'Zimbabwe'
      ]
    }
  }
}
</script>
