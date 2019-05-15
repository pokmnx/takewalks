<template>
  <div>
     <b-card no-body class="mb-1 fixed-bottom mobile" style="margin-bottom:0px !important;"> 
      <b-card-header header-tag="header" class="p-1" role="tab">
        <div class="booking-widget-footer">
          <div class="booking-widget-content">
            <span v-if="!Array.isArray(this.tour.priceDiscount)  && this.checkPromo()" class="price-value-footer strike-through">{{this.getPrice()}}</span>
            <span v-if="!Array.isArray(this.tour.priceDiscount)  && this.checkPromo()" class="price-value-footer">{{this.getDiscountPrice()}}</span>
            <span v-else class="price-value-footer"></span>
            <b-btn  class="book-footer-btn" href="#" v-b-toggle.accordion3 variant="info">BOOK NOW</b-btn>
          </div>
        </div>
      </b-card-header>
      <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
        <b-card-body class="card-body">
            <div class="right-book">
              <div class="book">
                <img class="booking-widget-close" v-b-toggle.accordion3 src="../../assets/svg/close-booking-widget.svg" alt="">
                <br>
                <br>
                <br>
                <nav class="currency-nav">
                  <a class="currency-toggler" data-currency="USD">USD</a>
                  <a class="currency-toggler" data-currency="EUR">EUR</a>
                  <a class="currency-toggler" data-currency="GBP">GBP</a>
                  <a class="currency-toggler" data-currency="CAD">CAD</a>
                  <a class="currency-toggler" data-currency="AUD">AUD</a>
                </nav>
                <PriceHeader />
                <div class="sidebar sidebar-booking">
                  <DateForm>
                    <div v-if="loadingAvailabilityMessage" class="no-tour-msg">Loading additional availability</div>
                    <div v-if="!tourAvailabilityMessage" class="no-tour-msg">No tours available for {{ month }}</div>
                  </DateForm>
                  <div class='wowo-time packages-time'>
                    <TimeForm />
                  </div>
                  <GuestsForm  v-bind:totalPrice="formattedTotal" v-bind:displaySingleEventPrice="this.eventPriceVisible()"/>
                  <UpgradeForm v-bind:totalPrice="formattedTotal" v-bind:displayUpgradesPrice="this.upgradesPriceVisible()" v-if="this.tour.hasXor"/>
                  <OptionForm v-bind:totalPrice="formattedTotal" v-bind:displayOptionsPrice="this.optionsPriceVisible()" v-if="this.tour.hasOr"/>
                </div>
                <BookSubmitForm />
              </div>
            </div>
        </b-card-body>
      </b-collapse>
    </b-card>
    <div class="right-book right-book-desktop desktop">
      <div class="book">
        <PriceHeader />
        <div class="sidebar sidebar-booking">
          <DateForm>
            <div v-if="loadingAvailabilityMessage" class="no-tour-msg">Loading additional availability</div>
            <div v-if="!tourAvailabilityMessage" class="no-tour-msg">No tours available for {{ month }}</div>
          </DateForm>
          <div class='wowo-time packages-time'>
            <TimeForm />
          </div>
          <GuestsForm v-bind:totalPrice="formattedTotal" v-bind:displaySingleEventPrice="this.eventPriceVisible()"/>
          <UpgradeForm v-bind:totalPrice="formattedTotal" v-bind:displayUpgradesPrice="this.upgradesPriceVisible()" v-if="this.tour.hasXor"/>
          <OptionForm v-bind:totalPrice="formattedTotal" v-bind:displayOptionsPrice="this.optionsPriceVisible()" v-if="this.tour.hasOr"/>
        </div>
        <BookSubmitForm />
      </div>
    </div>
  </div>
</template>
<script>

import Vue from 'vue'
// import store from '../../store'
import $ from 'jquery'
import BookSubmitForm from '@/containers/tour_detail/BookSubmitForm'
import DateForm from '@/containers/tour_detail/DateForm'
import GuestsForm from '@/containers/tour_detail/GuestsForm'
import UpgradeForm from '@/containers/tour_detail/UpgradeForm'
import OptionForm from '@/containers/tour_detail/OptionForm'
import PriceHeader from '@/containers/tour_detail/PriceHeader'
import TimeForm from '@/containers/tour_detail/TimeForm'
import { mapGetters } from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import store from '../../store'

require('@/lib/jquery.plugin.js')
require('@/lib/jquery.datepick.js')

const moment = require('moment')
require('moment/locale/es')
moment.locale('en')

Vue.use(require('vue-moment'), {
  moment
})
Vue.use(BootstrapVue)

export default {
  name: 'BookForm',
  components: {
    BookSubmitForm,
    DateForm,
    GuestsForm,
    PriceHeader,
    TimeForm,
    UpgradeForm,
    OptionForm
  },
  computed: {
    ...mapGetters([
      'currency',
      'tour',
      'initValues',
      'tags',
      'tourAvailability'
    ])
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  mounted () {
    window.addEventListener('resize', this.handleResize)
    this.toggleScrollBars(false)
    // var body = $('.mb-1.fixed-bottom')[0]
    if ($(window).width() < 1024) {
      this.device = 'mobile'
    }
    var ptClassName = '.right-book'
    if (document.documentElement.clientWidth > 1024) {
      ptClassName = '.right-book.right-book-desktop'
    }
    this.timeRequired = this.tour.time_select_required
    if (this.tour.hasXor && this.tour.hasOr) {
      this.pickerOrder = ['datePicker', 'timePicker', 'paxPicker', 'upgradesPicker', 'optionsPicker']
    } else if (this.tour.hasOr && !this.tour.hasXor) {
      this.pickerOrder = ['datePicker', 'timePicker', 'paxPicker', 'optionsPicker']
    } else if (!this.tour.hasOr && this.tour.hasXor) {
      this.pickerOrder = ['datePicker', 'timePicker', 'paxPicker', 'upgradesPicker']
    } else {
      this.pickerOrder = ['datePicker', 'timePicker', 'paxPicker']
    }
    this.form = $('form.book', $(ptClassName))
    this.heading = $('.sidebar-subheading', $(ptClassName))
    this.priceContainer = $('.sidebar-heading', $(ptClassName))
    this.adultPrice = $('.price-value', $(ptClassName))
    this.originalPrice = $('.original-price', $(ptClassName))
    this.datePicker = $('.date-picker-container', $(ptClassName))
    this.timePicker = $('.time-picker-container', $(ptClassName))
    this.upgradesPicker = $('.upgrades-picker-container', $(ptClassName))
    this.optionsPicker = $('.options-picker-container', $(ptClassName))
    this.paxPicker = $('.pax-picker-container', $(ptClassName))
    this.selectedDateInput = $('input.selected-date', $(ptClassName))
    this.upgradesPickerSelect = $('.upgrades-picker-container select', $(ptClassName))
    this.timePickerSelect = $('.time-picker-container select', $(ptClassName))
    this.timePickerSelected1 = $('.time-picker-container .selected-time', $(ptClassName))
    this.adultsPaxInput = $('.pax-picker-container [name=adults]', $(ptClassName))
    this.infantsPaxInput = $('.pax-picker-container [name=infants]', $(ptClassName))
    this.childrenPaxInput = $('.pax-picker-container [name=children]', $(ptClassName))
    this.studentsPaxInput = $('.pax-picker-container [name=students]', $(ptClassName))
    this.adultsPaxPrice = $('.pax-picker-container .adults-container .guest-price', $(ptClassName))
    this.infantsPaxPrice = $('.pax-picker-container .infants-container .guest-price', $(ptClassName))
    this.childrenPaxPrice = $('.pax-picker-container .children-container .guest-price', $(ptClassName))
    this.studentsPaxPrice = $('.pax-picker-container .students-container .guest-price', $(ptClassName))
    this.totalContainer = $('.pax-picker-container .total', $(ptClassName))
    this.errorMessage = $('.error-message', $(ptClassName))
    this.bookNowButton = $('.book-now-container .btn-book-now', $(ptClassName))
    this.totalGuestCount = $('.pax-picker-container .guest-amount', $(ptClassName))
    // this.totalPrice = $('.pax-picker-container .total-price', $(ptClassName))
    this.adestraDate = '00/00/00'
    this.adestraTime = ''
    this.productLocatorOptions = []
    this.timePickerSelect.change(this.timePickerSelected)
    $('select', this.paxPicker).change(this.updateTotalPrice)
    this.heading.click(this.headingSelect)
    this.selectedDateInput.click(this.headingSelect)

    // this.form.submit(addItemToCart)
    // init select2
    var self = this
    if (this.timeRequired === 0) {
      $('.wowo-time').hide()
      $('.sidebar-circle-guest').html('2')
    }
    // if package has required option and elective options
    if (this.tour.hasXor && this.tour.hasOr) {
      $('.packages-time').hide()
      $('.sidebar-circle-guest').html('2')
      $('.sidebar-circle-upgrades').html('3')
      $('.sidebar-circle-options').html('4')
    }
     // if package has required option but no elective options
    if (this.tour.hasXor && !this.tour.hasOr) {
      $('.packages-time').hide()
      $('.sidebar-circle-guest').html('2')
      $('.sidebar-circle-upgrades').html('3')
    }
    // if package doesn`t have required option but elective options
    if (!this.tour.hasXor && this.tour.hasOr) {
      $('.packages-time').hide()
      $('.sidebar-circle-guest').html('2')
      $('.sidebar-circle-options').html('3')
    }
    $('.time-select', $('.right-book')).select2({
      minimumResultsForSearch: 200 // disables search
    })

    $('.single-select').select2({
      minimumResultsForSearch: -1
    })
    this.datePickerSetup()
    $('.upgrades-select').on('change', function (event) {
      self.productLocatorOptions = []
      self.productLocatorOptions.push({value: $(this).find('option:selected').val(), name: $(this).find('option:selected').text(), stageId: $(this).find('option:selected').attr('data-stageId'), required: true})
      self.updateOptionsPicker()
      self.updateTotalPrice()
    })
    // show calendar
    this.goToStep('datePicker')

    // fill in adult price
    var adultPrice = 0
    switch (this.$store.state.Common.currency) {
      case 'USD':
        adultPrice = '$' + this.initValues.group_prices.adults_price.USD
        break
      case 'EUR':
        adultPrice = '€' + this.initValues.group_prices.adults_price.EUR
        break
      case 'GBP':
        adultPrice = '£' + this.initValues.group_prices.adults_price.GBP
        break
      case 'CAD':
        adultPrice = '$' + this.initValues.group_prices.adults_price.CAD
        break
      case 'AUD':
        adultPrice = '$' + this.initValues.group_prices.adults_price.AUD
        break
    }
    this.adultPrice.html(adultPrice)
    $('.price-value-footer').html(adultPrice)

    $('.currency-nav').find('[data-currency=' + this.currency + ']').addClass('active')
    $('.sidebar-booking').on('click', function () {
      $('.booking-error-message').hide()
    })
    $('.currency-toggler').on('click', function () {
      self.setCurrency($(this).attr('data-currency'))
    })

    $('[data-modal-toggler]').click(function (e) {
      e.stopPropagation()
      e.preventDefault()
      var attr = $(this).attr('data-modal-toggler')
      var target = $('[data-modal-target=' + attr + ']')
      $('.modal-overlay').addClass('active')
      target.show()
      target.css('top')
      target.addClass('active')
      $('body').addClass('no-scroll')
    })

    $('[data-modal-close]').click(function (e) {
      $('.modal-overlay').removeClass('active')
      $('[data-modal-target]').removeClass('active')
      setTimeout(function () {
        $('[data-modal-target]').hide()
      }, 200)
      $('body').removeClass('no-scroll')
    })
    this.$store.watch(() => this.$store.getters.currency, (newCurrency, oldCurrency) => {
      console.log('Currency Changed from ' + oldCurrency + ' to ' + newCurrency)
      self.setCurrency(newCurrency)
      var adultPrice = ''
      switch (self.$store.state.Common.currency) {
        case 'USD':
          adultPrice = '$' + self.initValues.group_prices.adults_price.USD
          break
        case 'EUR':
          adultPrice = '€' + self.initValues.group_prices.adults_price.EUR
          break
        case 'GBP':
          adultPrice = '£' + self.initValues.group_prices.adults_price.GBP
          break
        case 'CAD':
          adultPrice = '$' + self.initValues.group_prices.adults_price.CAD
          break
        case 'AUD':
          adultPrice = '$' + self.initValues.group_prices.adults_price.AUD
          break
      }
      self.adultPrice.html(adultPrice)
      $('.price-value-footer').html(adultPrice)
      // if the user has not selected a date and time yet there won't be any prices available to choose from, so the total cannot be calculated and options/upgrades cannot be selected
      if (typeof this.selectedTime === 'undefined') {
        return
      }
      self.updateOptionsPicker()
      if (self.selectedPicker === 'paxPicker') {
        self.updatePaxPicker()
        // self.updateTotalPrice()
      }
    })
    // determine which price display should be shown based on the options/upgrades available
    // if a tour has or options (checkboxes) only display the price at the very bottom of the booking widget
    if (this.tour.hasOr === true) {
      this.displaySingleEventPrice = false
      this.displayUpgradesPrice = false
      this.displayOptionsPrice = true
    // the tour has xor upgrades (select list) but does not have checkbox options
    // only display prices under the select list for upgrades
    } else if (this.tour.hasXor === true && this.tour.hasOr === false) {
      this.displaySingleEventPrice = false
      this.displayUpgradesPrice = true
      this.displayOptionsPrice = false
    // regular tour, do not display the price in the options/upgrades components
    } else {
      this.displaySingleEventPrice = true
      this.displayUpgradesPrice = false
      this.displayOptionsPrice = false
    }
  },
  selectedPicker: null,
  prices: null,
  pickerOrder: [],
  initValues: null,
  form: null,
  heading: null,
  priceContainer: null,
  adultPrice: null,
  originalPrice: null,
  datePicker: null,
  timePicker: null,
  upgradesPicker: null,
  optionsPicker: null,
  paxPicker: null,
  selectedDateInput: null,
  timePickerSelect: null,
  timePickerSelected: null,
  adultsPaxInput: null,
  infantsPaxInput: null,
  childrenPaxInput: null,
  studentsPaxInput: null,
  adultsPaxPrice: null,
  infantsPaxPrice: null,
  childrenPaxPrice: null,
  studentsPaxPrice: null,
  totalContainer: null,
  errorMessage: null,
  bookNowButton: null,
  totalGuestCount: null,
  totalPrice: null,
  page: 0,
  gettingNextPage: false,
  containerHeight: null,
  reviewContainer: null,
  cartDate: null,
  upgradesSelected: [],
  selectedOptions: [],
  cart: {},
  availability: {},
  data: function () {
    return {
      loadedMonths: [],
      tourId: null,
      mobileActive: false,
      tourAvailabilityMessage: false,
      loadingAvailabilityMessage: false,
      month: '',
      displayNextArrow: true,
      displayPreviousArrow: true,
      formattedTotal: 0,
      displaySingleEventPrice: false,
      displayUpgradesPrice: false,
      displayOptionsPrice: false,
      device: 'desktop'

    }
  },
  watch: {
    displayNextArrow: function () {
      if (this.displayNextArrow === false) {
        $('.datepick-cmd-next').hide()
      } else {
        $('.datepick-cmd-next').show()
      }
    },
    displayPreviousArrow: function () {
      if (this.displayPreviousArrow === false) {
        $('.datepick-cmd-prev').hide()
      } else {
        $('.datepick-cmd-prev').show()
      }
    }
  },
  methods: {
    nextMonth (event) {
      var currentMonth = this.$store.state.TourList.selectedMonth
      var nextMonth = currentMonth + 1
      var currentlyViewedMonth = nextMonth
      var maxLoadedMonth = this.loadedMonths[this.loadedMonths.length - 1]
      // if currentlyViewedMonth is not greater than the maximum of loaded availability allow the click to be registered
      if (currentlyViewedMonth <= maxLoadedMonth) {
        var fetchAvailability = this.checkExistingAvailability(currentlyViewedMonth)

        if (fetchAvailability === true) {
          console.log('fetching availability')

          var newDateRange = this.getNewDateRange(currentlyViewedMonth)
          var payload = {
            product_locator: this.tour.product_locator,
            firstDate: this.formatDateToString(newDateRange.firstDate),
            lastDate: this.formatDateToString(newDateRange.lastDate)
          }
          console.log(payload)

          // calls tourAvailability on TourList.js, which then calls getAvailability of TourLIstController.js
          store.dispatch('tourAvailability', payload)
          .then(response => {
            console.log('availability fetched')

            var firstDate = new Date(payload.firstDate + 'T00:00:00')
            var month = firstDate.getMonth()
            if (month < maxLoadedMonth) {
              month += 12
            }
            this.loadedMonths.push(month)
            this.refreshDatePicker(this.getMonthFromDate(payload.lastDate))
          })

          if (currentMonth < maxLoadedMonth) {
            this.rebindArrows()
          }
        // end of fetching availability
        } else {
          var date = new Date()
          this.checkMonthAvailabilities(date.getFullYear(), currentlyViewedMonth)
           // no availability to be fetched
          console.log('no availability to fetch')
          // only rebind the arrows if the currentMonth is less than the maxLoadedMonth
          // otherwise we'll get duplicate bindings
          if (currentMonth < maxLoadedMonth) {
            this.rebindArrows()
          }
        }
        this.$store.commit('setselectedMonth', currentlyViewedMonth)
        currentMonth = currentlyViewedMonth
      }
      console.log(currentMonth, maxLoadedMonth)
    },
    previousMonth () {
      var currentMonth = this.$store.state.TourList.selectedMonth
      var previousMonth = currentMonth - 1
      var currentlyViewedMonth = previousMonth
      var minMonth = this.$store.state.TourList.minMonth

      if (currentlyViewedMonth >= minMonth) {
        this.$store.commit('setselectedMonth', currentlyViewedMonth)
        this.rebindArrows()
        var date = new Date()
        this.checkMonthAvailabilities(date.getFullYear(), currentlyViewedMonth)
      }
      console.log('previous')
    },
    rebindArrows () {
      this.nextArrow = $('.datepick-cmd-next')
      this.nextArrow.click(this.nextMonth)
      this.previousArrow = $('.datepick-cmd-prev')
      this.previousArrow.click(this.previousMonth)
      console.log('arrows bound')
    },
    toggleScrollBars (open) {
      if (open) {
        $('html, body').animate({
          scrollTop: 320
        }, 1000)
        this.mobileActive = true
        $('html, body').css('overflow', 'hidden')
      }
    },
    upgradesPriceVisible () {
      return this.displayUpgradesPrice
    },
    optionsPriceVisible () {
      return this.displayOptionsPrice
    },
    eventPriceVisible () {
      return this.displaySingleEventPrice
    },
    checkPromo () {
      if (process.env.PROMOCODE !== undefined) {
        return true
      } else {
        this.mobileActive = false
        $('html, body').css('overflow-y', 'auto')
        $('html, body').css('overflow-x', 'hidden')
      }
    },
    /**
     * make sure the html scrollbar is on after resizing
     */
    handleResize (evt) {
      if (evt.target.outerWidth > 992) {
        this.toggleScrollBars(false)
      }
    },
    checkNextMonthArrowDisplay (month) {
      if (this.loadedMonths.includes(month + 1) === false) {
        return false
      }
      return true
    },
    checkPreviousArrowDisplay (month) {
      if (month !== this.$store.state.TourList.calendarSetup.minMonth) {
        return true
      }
    },
    getFormattedTotal (total) {
      switch (this.$store.state.Common.currency) {
        case 'USD':
          return '$' + total.toFixed(2)
        case 'EUR':
          return '€' + total.toFixed(2)
        case 'GBP':
          return '£' + total.toFixed(2)
        case 'CAD':
          return '$' + total.toFixed(2)
        case 'AUD':
          return '$' + total.toFixed(2)
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
      return false
    },
    getCurrentDateRange (currentMonth) {
      var date = new Date()
      var y = date.getFullYear()
      var firstDay = new Date(y, currentMonth, 1)
      var lastDay = this.createEndDateFromMonth(currentMonth)
      return {
        'firstDate': firstDay.toISOString().split('T')[0],
        'lastDate': lastDay.toISOString().split('T')[0]
      }
    },
    // checks if a month should be lazy loaded
    checkExistingAvailability (currentlyViewedMonth) {
      // // we want to maintain inventory for 3 months out.
      // // since the availability has been previously set for the first 3 months, add 3 for all future months to be checked
      // Ex: loadedMonths=[9,10,11] selectedMonth=10....we want to grab availability now for month 12
      var monthToLoad = currentlyViewedMonth + 2
      var maxMonth = this.$store.state.TourList.maxMonth
      // month not in cache, fetch new availability
      if (this.loadedMonths.includes(monthToLoad) === false && monthToLoad <= maxMonth) {
        return true
      }
      return false
    },
    checkDatesOnCalendar (selectedMonth) {
      var currentDate = new Date()
      var selectedDate = new Date(currentDate.getFullYear(), selectedMonth, 1)
      this.checkMonthAvailabilities(selectedDate.getFullYear(), selectedDate.getMonth())
    },
    getNewDateRange (selectedMonth) {
      var date = new Date()
      var y = date.getFullYear()

      var newFirstDate = new Date(y, selectedMonth + 2, 1)
      var newLastDate = this.createEndDateFromMonth(selectedMonth + 2)
      return {
        firstDate: newFirstDate,
        lastDate: newLastDate
      }
    },
    getUpgradePrice (price) {
      // alert(this.adultsPaxInput.val())
      // return this.tour.price['adults_price'][this.currency]['exchangeAmount']
      switch (this.$store.state.Common.currency) {
        case 'USD':
          return '$' + price.USD
        case 'EUR':
          return '€' + price.EUR
        case 'GBP':
          return '£' + price.GBP
        case 'CAD':
          return '$' + price.CAD
        case 'AUD':
          return '$' + price.AUD
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
    },
    setCurrency (newcurrency) {
      $('.currency-nav').find('.active').removeClass('active')
      this.$store.commit('setCurrency', newcurrency)
      $('.currency-nav').find('[data-currency=' + this.currency + ']').addClass('active')
      this.updateTotalPrice()
    },
    goToStep (step) {
      if (this.selectedPicker === 'paxPicker') {
        this.paxPicker.find('input[type=number]').val(0)
        this.updateTotalPrice()
      }
      // if the tour has a "required options"
      if (this.tour.hasXor && this.tour.hasOr) {
        var statuses = ['active', false, false, false, false]
        switch (step) {
          case 'datePicker':
            statuses = ['active', false, false, false, false]
            this.bookNowButton.attr('disabled', 'disabled')
            break
          case 'timePicker':
            this.updateTimePicker()
            statuses = ['completed', 'active', false, false, false]
            break
          case 'paxPicker':
            this.updateTotalPrice()
            statuses = ['completed', 'completed', 'active', 'active', 'active']
            break
          default:
            statuses = ['active', false, false, false]
            this.bookNowButton.attr('disabled', 'disabled')
            break
        }
        this.selectedPicker = step

        this.changeContainerStatus(this.datePicker, statuses[0])
        this.changeContainerStatus(this.timePicker, statuses[1])
        this.changeContainerStatus(this.paxPicker, statuses[2])
        this.changeContainerStatus(this.upgradesPicker, statuses[3])
        this.changeContainerStatus(this.optionsPicker, statuses[4])

      // if the tour is a package but only have elective options
      } else if (this.tour.hasOr && !this.tour.hasXor) {
        statuses = ['active', false, false, false]
        switch (step) {
          case 'datePicker':
            statuses = ['active', false, false, false]
            this.bookNowButton.attr('disabled', 'disabled')
            break
          case 'timePicker':
            this.updateTimePicker()
            statuses = ['completed', 'active', false, false]
            break
          case 'paxPicker':
            this.updateTotalPrice()
            statuses = ['completed', 'completed', 'active', 'active']
            break
          default:
            statuses = ['active', false, false, false]
            this.bookNowButton.attr('disabled', 'disabled')
            break
        }
        this.selectedPicker = step

        this.changeContainerStatus(this.datePicker, statuses[0])
        this.changeContainerStatus(this.timePicker, statuses[1])
        this.changeContainerStatus(this.paxPicker, statuses[2])
        this.changeContainerStatus(this.optionsPicker, statuses[3])
      // if the tour only have required options but no elective options
      } else if (!this.tour.hasOr && this.tour.hasXor) {
        statuses = ['active', false, false, false]
        switch (step) {
          case 'datePicker':
            statuses = ['active', false, false, false]
            this.bookNowButton.attr('disabled', 'disabled')
            break
          case 'timePicker':
            this.updateTimePicker()
            statuses = ['completed', 'active', false, false]
            break
          case 'paxPicker':
            this.updateTotalPrice()
            statuses = ['completed', 'completed', 'active', 'active']
            break
          default:
            statuses = ['active', false, false, false]
            this.bookNowButton.attr('disabled', 'disabled')
            break
        }
        this.selectedPicker = step

        this.changeContainerStatus(this.datePicker, statuses[0])
        this.changeContainerStatus(this.timePicker, statuses[1])
        this.changeContainerStatus(this.paxPicker, statuses[2])
        this.changeContainerStatus(this.upgradesPicker, statuses[3])
      // if the tour is a normal tour
      } else {
        statuses = ['active', false, false]
        switch (step) {
          case 'datePicker':
            statuses = ['active', false, false]
            this.bookNowButton.attr('disabled', 'disabled')
            break
          case 'timePicker':
            this.updateTimePicker()
            statuses = ['completed', 'active', false]
            break
          case 'paxPicker':
            this.updateTotalPrice()
            statuses = ['completed', 'completed', 'active']
            break
          default:
            statuses = ['active', false, false]
            this.bookNowButton.attr('disabled', 'disabled')
            break
        }
        this.selectedPicker = step
        this.changeContainerStatus(this.datePicker, statuses[0])
        this.changeContainerStatus(this.timePicker, statuses[1])
        this.changeContainerStatus(this.paxPicker, statuses[2])
      }
    },
    changeContainerStatus (container, status) {
      container.removeClass('active completed')
      container.addClass(status)
    },
    updateTotalPrice () {
      $('.sidebar-circle-guest').css({'background-color': '#57B69D', 'color': 'white', 'border-color': '#57B69D'})
      var totalPrice = 0

      // if the user has not selected a date and time yet there won't be any prices available to choose from, so the total cannot be calculated
      if (typeof this.selectedTime === 'undefined') {
        return
      } else if (typeof process.env.PROMOCODE !== 'undefined' && !Array.isArray(this.selectedTime.prices.currenciesDiscount.data)) {
        totalPrice += this.convertFormatPrice(this.selectedTime.prices.currenciesDiscount.data.adults_price) * Number(this.adultsPaxInput.val() - 1)
        totalPrice += this.convertFormatPrice(this.selectedTime.prices.currenciesDiscount.data.infants_price) * Number(this.infantsPaxInput.val() - 1)
        totalPrice += this.convertFormatPrice(this.selectedTime.prices.currenciesDiscount.data.children_price) * Number(this.childrenPaxInput.val() - 1)
        totalPrice += this.convertFormatPrice(this.selectedTime.prices.currenciesDiscount.data.students_price) * Number(this.studentsPaxInput.val() - 1)
      } else {
        totalPrice += this.convertFormatPrice(this.selectedTime.prices.currencies.data.adults_price) * Number(this.adultsPaxInput.val() - 1)
        totalPrice += this.convertFormatPrice(this.selectedTime.prices.currencies.data.infants_price) * Number(this.infantsPaxInput.val() - 1)
        totalPrice += this.convertFormatPrice(this.selectedTime.prices.currencies.data.children_price) * Number(this.childrenPaxInput.val() - 1)
        totalPrice += this.convertFormatPrice(this.selectedTime.prices.currencies.data.students_price) * Number(this.studentsPaxInput.val() - 1)
      }

      var totalGuestCount = Number(this.adultsPaxInput.val() - 1)
      totalGuestCount += Number(this.infantsPaxInput.val() - 1)
      totalGuestCount += Number(this.childrenPaxInput.val() - 1)
      totalGuestCount += Number(this.studentsPaxInput.val() - 1)

      this.totalGuestCount.html(totalGuestCount)

      var selectedUpgrade = $('.upgrades-select').find('option:selected').val()
      // if the selectedUpgrade is undefined the tour doesn't have one
      if (typeof selectedUpgrade === 'undefined') {
        // eslint-disable-next-line
        selectedUpgrade == null
      }
      this.selectedUPgrades = selectedUpgrade

      var selectedOptions = []
      $.each($("[class='optionsCheckbox']:checked"), function () {
        selectedOptions.push(parseInt($(this).val()))
      })
      this.selectedOptions = selectedOptions

      var paxCounts = {
        adults_price: this.adultsPaxInput.val() - 1,
        students_price: this.studentsPaxInput.val() - 1,
        children_price: this.childrenPaxInput.val() - 1,
        infants_price: this.infantsPaxInput.val() - 1,
        seniors_price: 0 // TODO: verify that adults are used in place of seniors
      }

      if (this.tour.product_locator_type.toLowerCase() === 'package' && selectedOptions.length > 0) {
        var optionsTotal = this.calculateOptionsTotal(this.$store.state.Common.currency, this.adultsPaxInput.val() - 1, this.studentsPaxInput.val() - 1, this.childrenPaxInput.val() - 1)
        totalPrice += optionsTotal
        // this.tour.price is the base price of the "root" tour
        // this.selectedTime.product is all of the upgrades/options for a tour,
        var payload = {
          baseTourPrices: this.tour.price,
          packageContents: this.selectedTime.product,
          selectedOptions: selectedOptions,
          paxCounts: paxCounts
        }
        this.$store.dispatch('calculatePackageCurrencyConvertedTotals', payload)
        var currencyConvertedTotals = this.$store.state.TourList.currencyConvertedProductTotals
      } else {
        // there are no options for the tour, calculate the totals by multiplying the pax counts to the base tour price
        payload = {
          baseTourPrices: this.tour.price,
          paxCounts: paxCounts
        }
        this.$store.dispatch('calculateEventCurrencyConvertedTotals', payload)
        currencyConvertedTotals = this.$store.state.TourList.currencyConvertedProductTotals
      }

      this.$store.dispatch('calculateCurrencyConvertedSubTotals', currencyConvertedTotals)
      var currencyConvertedSubTotals = this.$store.state.TourList.currencyConvertedSubTotals

      // set formatted price to be used on booking widget with correct currenc
      this.formattedTotal = this.getFormattedTotal(totalPrice)

      // eslint-disable-next-line
      var totalHtml = ''
      switch (this.$store.state.Common.currency) {
        case 'USD':
          totalHtml = '$' + totalPrice.toFixed(2)
          break
        case 'EUR':
          totalHtml = '€' + totalPrice.toFixed(2)
          break
        case 'GBP':
          totalHtml = '£' + totalPrice.toFixed(2)
          break
        case 'CAD':
          totalHtml = '$' + totalPrice.toFixed(2)
          break
        case 'AUD':
          totalHtml = '$' + totalPrice.toFixed(2)
          break
      }

      this.totalPrice = totalPrice

      // show total price and book now if price if user selected guests
      $('.booking-sidebar-heading').css('display', totalPrice > 0 ? 'flex' : 'none')
      this.totalContainer.css('display', totalPrice > 0 ? 'inline-block' : 'none')
      this.bookNowButton.toggleClass('purple', totalPrice > 0)
      if (totalPrice > 0) {
        this.bookNowButton.attr('disabled', false)
      } else {
        this.bookNowButton.attr('disabled', 'disabled')
      }

      var guests = []
      if (this.adultsPaxInput.val() - 1 > 0) {
        guests.push({
          type: 'adults',
          count: this.adultsPaxInput.val() - 1
        })
      }

      if (this.infantsPaxInput.val() - 1 > 0) {
        guests.push({
          type: 'infants',
          count: this.infantsPaxInput.val() - 1
        })
      }

      if (this.childrenPaxInput.val() - 1 > 0) {
        guests.push({
          type: 'children',
          count: this.childrenPaxInput.val() - 1
        })
      }

      if (this.studentsPaxInput.val() - 1 > 0) {
        guests.push({
          type: 'students',
          count: this.studentsPaxInput.val() - 1
        })
      }
      var stageIds = []
      if (typeof this.tour.hasXor === 'undefined' && typeof this.tour.hasOr === 'undefined') {
        stageIds.push(this.selectedTime.product.stage_id)
      } else {
        stageIds = this.getProductStageIds(selectedOptions, selectedUpgrade)
      }

      this.cart = {
        name: this.tour.shortTitle,
        slug: this.$route.path,
        shortSlug: this.$route.params.slug,
        eventID: this.tour.eventID,
        date: this.cartDate,
        price: this.selectedTime.prices.currencies.data,
        totalPrice: currencyConvertedTotals,
        subTotals: currencyConvertedSubTotals,
        discount: this.tour.discount,
        guests: guests,
        pax_remaining: this.selectedTime.pax_remaining,
        staging_id: stageIds.join(''),
        meetingPointAddress: this.tour.meetingPointAddress,
        meetingPointMapImage: this.tour.meetingPointMapImage,
        meetingPointMapUrl: this.tour.meetingPointMapUrl,
        product_locator: this.tour.product_locator,
        time_select_required: this.tour.time_select_required,
        city: this.tour.cityName,
        country: this.tour.countryName,
        adestraDate: this.adestraDate,
        adestraTime: this.adestraTime,
        datetime: this.selectedTime.datetime,
        productLocatorType: this.tour.product_locator_type,
        productLocator: this.tour.product_locator,
        productLocatorOptions: this.productLocatorOptions,
        productLocatorOptionsData: this.productLocatorOptions,
        packageContents: this.selectedTime.product
      }
      this.$store.dispatch('setTempCart', this.cart)
    },
    calculatePackageCurrencyConvertedTotal (baseTourPrices, packageContents, selectedOptions, paxCounts) {
      var pricesToAdd = []
      var newPrices = {}
      // loop through the packageContents and determine all of the packageContents which have been selected by the user
      for (var i = 0; i < packageContents.length; i++) {
        if (selectedOptions.includes(packageContents[i].product_map_id)) {
          pricesToAdd.push(packageContents[i].prices.currencies.data)
        }
      }
      // loop through the options that have to be added to the base price
      for (i = 0; i < pricesToAdd.length; i++) {
        var paxTypes = Object.keys(pricesToAdd[i])  // creates an array of "adults_price", "students_price", etc...
        // loop through each of the pax types and add the currencies to their respective indices of the baseTourPrices object
        for (var j = 0; j < paxTypes.length; j++) {
          var paxType = paxTypes[j]
          // if the paxType for the newPrices object are undefined this is the first loop and the properties don't exist yet. Ex: {adults_price, students_price, etc...}
          if (typeof newPrices[paxType] === 'undefined') {
            var currencies = Object.keys(pricesToAdd[i][paxType])
            newPrices[paxType] = {}
          }
          // loop through the currencies and add them to the original baseTourPrices
          for (var k = 0; k < currencies.length; k++) {
            var currencyCode = currencies[k]
            // if the currencies indexs don't exist yet (ex: adults_price: {USD: 123, EUR: 456, etc...})
            if (typeof newPrices[paxType][currencyCode] === 'undefined') {
              // add the base price to the option price and multiply by number of pax
              newPrices[paxType][currencyCode] = ((parseFloat(baseTourPrices[paxType][currencyCode]) + parseFloat(pricesToAdd[i][paxType][currencyCode])) * paxCounts[paxType]).toFixed(2)
            } else {
              // the index already exists and contains the base price already, so only add the newly checked option to the existing index
              // NOTE: THE PAX COUNT IS ONLY MULTIPLIED BY THE OPTION IN THIS ITERATION!!!!
              // PAY ATTENTION TO THE PARENTHESIS!
              // the base price will already have the pax count multiplied against it from the first iteration. We're only adding the option to the base pricethis iteration, so only mu so only multiply the pax count by the option.
              newPrices[paxType][currencyCode] = (parseFloat(newPrices[paxType][currencyCode]) + (parseFloat(pricesToAdd[i][paxType][currencyCode]) * paxCounts[paxType])).toFixed(2)
            }
          }
        }
      }
      return newPrices
    },
    // creates new object of tour prices by multiplying the base price by pax counts
    calculateEventCurrencyConvertedTotal (baseTourPrices, paxCounts) {
      var newPrices = {}
      var paxTypes = Object.keys(baseTourPrices)  // creates an array of "adults_price", "students_price", etc...
      // loop through each of the pax types and add the currencies to their respective indices of the baseTourPrices object
      for (var i = 0; i < paxTypes.length; i++) {
        var paxType = paxTypes[i]
        // if the paxType for the newPrices object are undefined this is the first loop and the properties don't exist yet. Ex: {adults_price, students_price, etc...}
        if (typeof newPrices[paxType] === 'undefined') {
          var currencies = Object.keys(baseTourPrices[paxType])
          newPrices[paxType] = {}
        }
        // loop through the currencies and add them to the original baseTourPrices
        for (var j = 0; j < currencies.length; j++) {
          var currencyCode = currencies[j]
          newPrices[paxType][currencyCode] = (parseFloat(baseTourPrices[paxType][currencyCode]) * paxCounts[paxType]).toFixed(2)
        }
      }
      return newPrices
    },
    // calculates subtotals for a product by currency
    calculateCurrencyConvertedSubtotals (currencyConvertedTotals) {
      var subtotals = {'AUD': 0.00, 'CAD': 0.00, 'EUR': 0.00, 'GBP': 0.00, 'TRY': 0.00, 'USD': 0.00}
      var currencies = Object.keys(subtotals)
      var paxTypes = Object.keys(currencyConvertedTotals) // array of "adults_price", "students_price", etc...

      for (var i = 0; i < paxTypes.length; i++) {
        for (var j = 0; j < currencies.length; j++) {
          // eslint-disable-next-line
          if (typeof currencyConvertedTotals[paxTypes[i]][currencies[j]] === 'NaN') {
            currencyConvertedTotals[paxTypes[i]][currencies[j]] = 0.00
          }
          subtotals[currencies[j]] = (parseFloat(subtotals[currencies[j]]) + parseFloat(currencyConvertedTotals[paxTypes[i]][currencies[j]])).toFixed(2)
        }
      }
      return subtotals
    },
    // called by updateTotalPrice, returns all stage ID's for a product during the process of viewing a tour page and selecting pax counts
    getProductStageIds (selectedOptions, selectedUpgrade) {
      var stageIds = []
      var selectedProductMapIds = []
      selectedProductMapIds.push(...selectedOptions) // DO NOT REMOVE SPREAD OPERATOR (...)

      if (typeof selectedUpgrade !== 'undefined') {
        selectedProductMapIds.push(...selectedUpgrade) // DO NOT REMOVE SPREAD OPERATOR (...)
      }
      if (this.tour.hasXor) {
        stageIds.push($('.upgrades-select').find('option:selected').attr('data-stageId')) // DO NOT REMOVE SPREAD OPERATOR (...)
      }
      for (var i = 0; i < this.selectedTime.product.length; i++) {
        if (this.selectedTime.product[i].operator === 'and') {
          stageIds.push(this.selectedTime.product[i].stage_id)
          continue
        }
        if (selectedProductMapIds.includes(this.selectedTime.product[i].product_map_id)) {
          stageIds.push(this.selectedTime.product[i].stage_id)
        }
      }
      return stageIds
    },
    calculateOptionsTotal (currencyCode, numberAdults, numberStudents, numberChildren) {
      var packageContents = this.selectedTime.product
      var selectedPackageOptions = []
      // build array of the components from the package that have been selected
      for (var i = 0; i < packageContents.length; i++) {
        if (this.selectedOptions.includes(packageContents[i].product_map_id)) {
          selectedPackageOptions.push(packageContents[i])
        }
      }
      var optionsTotal = 0
      for (i = 0; i < selectedPackageOptions.length; i++) {
        optionsTotal += selectedPackageOptions[i].prices.currencies.data.adults_price[currencyCode] * numberAdults
        optionsTotal += selectedPackageOptions[i].prices.currencies.data.students_price[currencyCode] * numberStudents
        optionsTotal += selectedPackageOptions[i].prices.currencies.data.children_price[currencyCode] * numberChildren
      }
      return parseFloat(optionsTotal.toFixed(2))
    },
    convertPrice (price) {
      if (price.USD === '0.00' || price.USD === 0) {
        return 'FREE'
      }
      switch (this.$store.state.Common.currency) {
        case 'USD':
          return '$' + price.USD
        case 'EUR':
          return '€' + price.EUR
        case 'GBP':
          return '£' + price.GBP
        case 'CAD':
          return '$' + price.CAD
        case 'AUD':
          return '$' + price.AUD
      }
    },
    convertFormatPrice (price) {
      if (price.USD === '0.00' || price.USD === 0) {
        return 0
      }
      switch (this.$store.state.Common.currency) {
        case 'USD':
          return price.USD
        case 'EUR':
          return price.EUR
        case 'GBP':
          return price.GBP
        case 'CAD':
          return price.CAD
        case 'AUD':
          return price.AUD
      }
      return price
    },
    headingSelect (event) {
      var clickedHeading = event.currentTarget.parentElement.getAttribute('data-section')
      if (this.pickerOrder.indexOf(clickedHeading) <= this.pickerOrder.indexOf(this.selectedPicker)) {
        this.goToStep(clickedHeading)
      }
      // datePicker was closed and re-opened, must be refreshed so new dates can be fetched again
      this.refreshDatePicker()
    },
    updatePaxPicker () {
      this.adultsPaxPrice.html(this.convertPrice(this.selectedTime.prices.currencies.data.adults_price))
      this.infantsPaxPrice.html(this.convertPrice(this.selectedTime.prices.currencies.data.infants_price))
      this.childrenPaxPrice.html(this.convertPrice(this.selectedTime.prices.currencies.data.children_price))
      this.studentsPaxPrice.html(this.convertPrice(this.selectedTime.prices.currencies.data.students_price))
    },
    updateTimePicker () {
      this.timePickerSelect.html('').append($('<option>'))
      var self = this
      console.log(this.selectedDate)
      Object.keys(this.selectedDate).forEach(function (time) {
        time = Vue.moment('2001-01-01 ' + time)
        self.timePickerSelect.append($('<option>', {value: time.format('HH:mm:ss')}).html(time.format('h:mm a')))
      })
    },
    updateUpgradesPicker () {
      this.upgradesPickerSelect.empty()
      var self = this
      Object.keys(this.selectedTime.product).forEach(function (index) {
        if (self.selectedTime.product[index].operator === 'xor' && self.selectedTime.product[index].status === 'Available') {
          self.upgradesPickerSelect.append($('<option value="' + self.selectedTime.product[index].product_map_id + '" data-stageId="' + self.selectedTime.product[index].stage_id + '">' + self.selectedTime.product[index].product_name + '</option>'))
        }
      })
      if (this.productLocatorOptions.length === 0) {
        this.productLocatorOptions.push({value: $('.upgrades-select').find('option:selected').val(), name: $('.upgrades-select').find('option:selected').text(), stageId: $('.upgrades-select').find('option:selected').attr('data-stageId'), required: true})
      }
      if (this.tour.hasOr) {
        this.updateOptionsPicker()
      }
    },
    updateOptionsPicker () {
      $('.checkbox-center-booking-widget').empty()
      var self = this
      Object.keys(this.selectedTime.product).forEach(function (index) {
        self.upgradesSelected = []
        if (self.selectedTime.product[index].operator === 'or' && self.selectedTime.product[index].status === 'Available') {
          // eslint-disable-next-line
          $('.' + self.device + ' .checkbox-center-booking-widget').append('<div class="css-checkbox compare-cb green-cb"><input type="checkbox" class="optionsCheckbox" id="ccw_' + index +'" value="' + self.selectedTime.product[index].product_map_id  + '"data-stageId="' + self.selectedTime.product[index].stage_id +'" data-name="' + self.selectedTime.product[index].product_name + '"><label for="ccw_' + index+'">' + self.selectedTime.product[index].product_name + '</label><div class="upgrades-price">' + self.getUpgradePrice(self.selectedTime.product[index].prices.currencies.data.adults_price) + '</div>')
          // create event listener for checkbox
          $('.optionsCheckbox').on('change', function (event) {
            self.updateTotalPrice()
          })
        }
      })
    },
    timePickerSelected (event) {
      this.bookNowButton.attr('disabled', 'disabled')
      var val = event.currentTarget.value
      var time = Vue.moment('2001-01-01 ' + val).format('HH:mm')
      this.adestraTime = time
      var standarTime = this.getFormattedTime(time.split(':').join(''))
      this.cartDate = Vue.moment(this.cartDate).format('ddd, D MMM, YYYY ') + 'at ' + standarTime
      this.selectedTime = this.selectedDate[time]
      this.prices = this.selectedTime.prices
      $('.selected-time').val(val).trigger('change.select2')
      this.updatePaxPicker()
      this.goToStep('paxPicker')
      if (this.cart !== undefined) {
        this.cart.date = this.cartDate
        this.cart.staging_id = this.selectedTime.stage_id
        this.$store.dispatch('setTempCart', this.cart)
        if (this.cart.guests.length > 0) {
          this.bookNowButton.attr('disabled', false)
        }
      }
      $('.book-now-container').show()
      console.log($(document).height())
      if (!this.mobileActive) {
        $('html, body').animate({
          scrollTop: 620
        }, 1000)
      }
      $('.card-body').animate({
        scrollTop: 620
      }, 1000)
    },
    resetPaxPicker () {
      this.goToStep('datePicker')
      this.paxPicker.find('select').val(0).eq(0).trigger('change')
    },
    formatDate (date) {
      return Vue.moment(date).format('YYYY-MM-DD')
    },
    dateSelect (date) {
      console.log(date)
      // var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      this.bookNowButton.attr('disabled', 'disabled')
      date = date[0]
      this.cartDate = date
      $('.sidebar-selected-value .selected-date', $('.date-picker-container')).val(Vue.moment(date).format('D MMMM YYYY'))
      this.selectedDate = JSON.parse(this.initValues.dates_group)[this.formatDate(date)]
      this.selectedDate = JSON.parse(this.$store.state.TourList.availability)
      this.selectedDate = this.selectedDate[this.formatDate(date)]
      this.updateTimePicker()
      if (this.timeRequired === 0 || this.tour.product_locator_type.toLowerCase() === 'package') {
        var time = '09:00'
        if (this.tour.product_locator_type.toLowerCase() === 'package') {
          time = Object.keys(this.selectedDate)[0]
          this.cartDate = Vue.moment(this.cartDate).format('D MMM, ddd, YYYY ')
        } else {
          this.cartDate = Vue.moment(this.cartDate).format('D MMM, ddd, YYYY ') + 'at ' + time
        }
        this.selectedTime = this.selectedDate[time]
        this.prices = this.selectedTime.prices
        this.updatePaxPicker()
        if (this.tour.hasXor) {
          this.updateUpgradesPicker()
        }
        if (this.tour.hasOr && !this.tour.hasXor) {
          this.updateOptionsPicker()
        }
        this.goToStep('paxPicker')
      } else {
        this.goToStep('timePicker')
      }
      this.adestraDate = Vue.moment(this.cartDate).format('MM/DD/YYYY')
      $('.right-book', $('.tour-detail-content')).find('input[name=date]').val(Vue.moment(date).format('YYYY-MM-DD'))
      if (this.cart !== undefined) {
        this.cart.date = this.cartDate
        this.$store.dispatch('setTempCart', this.cart)
      }
    },
    whitelistDays (date, inMonth) {
      if (this.whitelistDates.indexOf(this.formatDate(date)) === -1) {
        return {
          selectable: false,
          dateClass: 'disabled-date'
        }
      }
      return {}
    },
    // returns date range used for the datepicker lazy loading
    availabilityDateRange () {
      var availability = JSON.parse(this.$store.state.TourList.availability)
      if (Object.keys(availability).length === 0) {
        var startDate = new Date()
        var endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 13, 0)
      } else {
        var firstDateAvailable = this.formatDateToString(Object.keys(availability)[0])
        startDate = new Date(firstDateAvailable + 'T00:00:00')
        endDate = new Date(Object.keys(availability)[Object.keys(availability).length - 1] + 'T00:00:00')
      }
      return {
        startDate: this.formatDateToString(startDate),
        endDate: this.formatDateToString(endDate)
      }
    },
    createEndDateFromMonth (month) {
      var date = new Date()
      var year = date.getFullYear()
      if (month > 11) {
        month -= 12
        year += 1
      }
      var lastDayOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      console.log('creating end date from month ' + month)
      console.log(year, month, lastDayOfMonths[month])
      return new Date(year, month, lastDayOfMonths[month])
    },
    formatDateToString (date) {
      if (typeof date === 'object') {
        var dateString = Vue.moment(date).format('YYYY-MM-DD')
        date = new Date(dateString + 'T00:00:00')
      }
      return Vue.moment(date).format('YYYY-MM-DD')
    },
    getMonthFromDate (date) {
      if (typeof date === 'object') {
        date = this.formatDateToString(date)
      }
      var currentDate = new Date()
      var currentYear = parseInt(Vue.moment(currentDate).format('YYYY'))
      date = new Date(date + 'T00:00:00')
      var year = parseInt(Vue.moment(date).format('YYYY'))
      var month = date.getMonth()
      console.log('test')
      // if the year from the date passed in is not the same as the current year, the date is in next year.
      // Add 12 to the month to set it to be next year (JS uses 0-11 for months, not 1-12)
      // Ex: dec 2019 month is 11, jan 2020 is 12, Feb 2020 is 13
      if (currentYear !== year) {
        month += 12
      }
      return month
    },
    setLoadedMonths (firstMonth = null, lastMonth = null) {
      if (firstMonth === null || lastMonth === null) {
        this.loadedMonths = [] // empty the loaded months so it can be re-filled
        var availability = JSON.parse(this.$store.state.TourList.availability)
        firstMonth = this.getMonthFromDate(new Date())
        var lastDate = Object.keys(availability)[Object.keys(availability).length - 1]
        lastMonth = this.getMonthFromDate(new Date(lastDate + 'T00:00:00'))
      }
      for (var i = firstMonth; i <= lastMonth; i++) {
        this.loadedMonths.push(i)
      }
    },
    addToLoadedMonths () {
      var maxLoadedMonth = this.loadedMonths[this.loadedMonths.length - 1]
      this.loadedMonths.push(maxLoadedMonth + 1)
    },
    // checks initial availability to make sure the datePicker has all of the parameters set up correctly before loading on DOM
    // selectedMonth, minMonth and maxMonth are set here
    datePickerSetup () {
      var availability = JSON.parse(this.$store.state.TourList.availability)
      var currentDate = new Date()
      var currentMonth = this.getMonthFromDate(currentDate)
      var firstDateOfCurrentMonth = new Date(currentDate.getFullYear(), currentMonth, 1)
      // if there is no availability from the initial call when the tour page loads the remainder of the year must be fetched
      if (Object.keys(availability).length === 0) {
        var lastDate = new Date(currentDate.getFullYear(), currentMonth + 14, 0)
        var payload = {
          product_locator: this.tour.product_locator,
          firstDate: this.formatDateToString(firstDateOfCurrentMonth),
          lastDate: this.formatDateToString(lastDate)
        }
        // console.log(lastDate.getMonth())
        // fetch availability for the full year
        // calls tourAvailability on TourList.js, which then calls getAvailability of TourLIstController.js
        this.$store.dispatch('tourAvailability', payload)
        .then(response => {
          // set availability again now that it has been fetched
          availability = JSON.parse(this.$store.state.TourList.availability)
          // if there is no availability at all even after fetching a full year, which means there is no schedule loaded
          if (Object.keys(availability).length === 0) {
            var minMonth = currentMonth
            var selectedMonth = currentMonth
          } else { // the newly fetched full year has a availability
            minMonth = this.getMonthFromDate(Object.keys(availability)[0])
            selectedMonth = minMonth
          }
          this.$store.commit('setMinMonth', minMonth)
          this.$store.commit('setselectedMonth', selectedMonth)

          var lastMonth = this.getMonthFromDate(lastDate)
          // if the minMonth is greater than the lastmonth, that means the lastMonth is into next year
          // add a full year to it (JS uses 0-11 for months), so january would be 12....11 + 0 would still be december, so add 1 making it january
          if (minMonth >= lastMonth) {
            lastMonth += 12
          }
          // additional availability had to be fetched
          console.log('last month: ' + lastMonth)
          this.setLoadedMonths(minMonth, lastMonth)
          this.initializeDatePicker(lastMonth)
        }) // closing of fetching availability for full year after the initial call returned no availability
      // there is availability returned by the initial call
      } else {
        // get the first date of availability
        var firstDateAvaialble = new Date(Object.keys(availability)[0] + 'T00:00:00')
        console.log(Object.keys(availability)[0])
        var firstMonthAvailable = this.getMonthFromDate(firstDateAvaialble)

        // if the firstDateAvailable isn't the current month (ex: March is first month, current month is Jan), additional dates must be fetched so that 3 months of availability will be available for lazy loading
        if (firstMonthAvailable !== currentMonth) {
          // additional availability will have to be fetched for the number of months ahead that the first date of availability is from the current month
          // if the currentMonth is greater than the first Month available it's next year. Ex: cur month is Nov, first month is Feb
          if (currentMonth > firstMonthAvailable) {
            // add 11 to set the first Month available (full year in JS dates...0-11 rather than 11-12)
            firstMonthAvailable += 11
          }
          var numMonthsToFetch = (firstMonthAvailable - currentMonth)
          var startingMonth = currentMonth + 3 // the initial availability fetch is 3 months out, so add 3 to the current month to start availability fetch 4 months out
          var firstDate = new Date(currentDate.getFullYear(), startingMonth, 1)
          lastDate = new Date(currentDate.getFullYear(), startingMonth + numMonthsToFetch, 0)
          console.log(currentDate.getFullYear())
          console.log(startingMonth)
          console.log(numMonthsToFetch)
          console.log(firstMonthAvailable)
          console.log(currentMonth)
          console.log(new Date(currentDate.getFullYear(), startingMonth + numMonthsToFetch, 0))
          payload = {
            product_locator: this.tour.product_locator,
            firstDate: this.formatDateToString(firstDate),
            lastDate: this.formatDateToString(lastDate)
          }
          // fetch availability for the newly calculated difference
          this.$store.dispatch('tourAvailability', payload)
          .then(response => {
            // set availability again now that it has been fetched
            availability = JSON.parse(this.$store.state.TourList.availability)
            firstDateAvaialble = this.formatDateToString(Object.keys(availability)[0])
            var minMonth = this.getMonthFromDate(firstDateAvaialble)
            var selectedMonth = minMonth
            this.$store.commit('setselectedMonth', selectedMonth)
            this.$store.commit('setMinMonth', minMonth)
            this.setLoadedMonths(minMonth, this.getMonthFromDate(lastDate))
            this.initializeDatePicker()
          }) // closing of fetching availability for the difference of the current month and the first month of availability returned
        // no need to fetch additional availability, the first month available is in the current month
        } else {
          var selectedMonth = currentMonth
          this.$store.commit('setselectedMonth', selectedMonth)
          this.$store.commit('setMinMonth', selectedMonth)
          this.setLoadedMonths(currentMonth, currentMonth + 2)
          this.initializeDatePicker()
        }
      }
    },
    initializeDatePicker (lastMonth = null) {
      var availability = JSON.parse(this.$store.state.TourList.availability)
      this.whitelistDates = Object.keys(availability)
      var availabilityDateRange = this.availabilityDateRange()

      // if lastMonth is set that means the full year was probably loaded due to a schedule not starting on the first month available
      // we'll need to specify the end date because the schedule may only have 1 month loaded, making the calendar unable to scroll out to the full year
      if (lastMonth !== null) {
        availabilityDateRange.endDate = this.formatDateToString(this.createEndDateFromMonth(lastMonth))
      }

      console.log('last date on datepicker ' + availabilityDateRange.endDate)

      var picker = $('.datepick', $('.date-picker-container'))
      picker.datepick({
        changeMonth: false,
        prevText: '<svg version="1.1" viewBox="0 0 17.005 31.998" class="icon icon-arrow_left svg-icon svg-fill" style="width: 15px; height: 15px; color:#443D47;"><path pid="0" _fill="#B8C2C8" d="M16.743.248a.888.888 0 0 0-1.23 0L.263 15.388a.84.84 0 0 0 0 1.22l15.25 15.14c.17.17.39.25.62.25.22 0 .44-.08.61-.25.35-.34.35-.88 0-1.21l-14.63-14.54 14.63-14.54a.83.83 0 0 0 0-1.21z"></path></svg>',
        nextText: '<svg version="1.1" viewBox="0 0 17.005 31.998" class="icon icon-arrow_left svg-icon svg-fill" style="width: 15px; height: 15px; color:#443D47;"><path pid="0" _fill="#B8C2C8" d="M16.743.248a.888.888 0 0 0-1.23 0L.263 15.388a.84.84 0 0 0 0 1.22l15.25 15.14c.17.17.39.25.62.25.22 0 .44-.08.61-.25.35-.34.35-.88 0-1.21l-14.63-14.54 14.63-14.54a.83.83 0 0 0 0-1.21z"></path></svg>',
        showOtherMonths: false,
        selectOtherMonths: true,
        dayNamesMin: ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'],
        minDate: new Date(availabilityDateRange.startDate + 'T00:00:00'),
        maxDate: new Date(availabilityDateRange.endDate + 'T00:00:00'),
        onDate: this.whitelistDays,
        onSelect: this.dateSelect,
        useMouseWheel: false
      })

      this.nextArrow = $('.datepick-cmd-next')
      this.nextArrow.click(this.nextMonth)
      this.previousArrow = $('.datepick-cmd-prev')
      this.previousArrow.click(this.previousMonth)
      var date = new Date()
      this.checkMonthAvailabilities(date.getFullYear(), this.$store.state.TourList.selectedMonth)
    },
    /**
     * Verify if there is tour available for the selected @month of the selected @year
     * this.tourAvailabilityMessage & this.month are then used to display message in template
     * @param {String, Int} year - current year
     * @param {String, Int} month - current month
     */
    checkMonthAvailabilities (year, month) {
      const valid = this.whitelistDates.filter((date, index) => {
        const fdate = date.split('-')
        return parseInt(fdate[0]) === year && parseInt(fdate[1]) === month + 1
      })
      const curMonth = Vue.moment().month(month).format('MMMM')
      this.tourAvailabilityMessage = !!valid.length
      if (!this.tourAvailabilityMessage) { this.month = curMonth }
      console.log(`number of tour available for ${curMonth}: ${valid.length}`)
    },
    refreshDatePicker (lastMonth = null) {
      // whitelistDates are the highlighted blocks on the calendear for available dates
      // delete this.$store.state.TourList.availability.tour_id
      this.whitelistDates = Object.keys(JSON.parse(this.$store.state.TourList.availability))
      var date = new Date()
      var y = date.getFullYear()
      // startDate is the first day of the selected month of the calendar
      // if startDate is not set when the calendar refreshes it will switch back fo the first month of availability
      var startDate = new Date(y, this.$store.state.TourList.selectedMonth, 1)
      startDate = new Date(this.formatDateToString(startDate) + 'T00:00:00')

      if (lastMonth === null) {
        lastMonth = this.loadedMonths[this.loadedMonths.length - 1]
      }
      // var lastDate = new Date(y, lastMonth, 0)
      var lastDate = this.createEndDateFromMonth(lastMonth)
      lastDate = new Date(this.formatDateToString(lastDate) + 'T00:00:00')

      console.log('last date on datepicker ' + lastDate)

      // set the new datePicker options
      $('.datepick', $('.date-picker-container')).datepick('option', 'defaultDate', startDate)
      $('.datepick', $('.date-picker-container')).datepick('option', 'maxDate', lastDate)

      this.checkMonthAvailabilities(startDate.getFullYear(), this.getMonthFromDate(startDate))

      var currentMonth = this.$store.state.TourList.selectedMonth
      var maxLoadedMonth = lastMonth

      if (currentMonth < maxLoadedMonth) {
        this.rebindArrows()
      }
      console.log('datepicker refreshed')
    },
    getFormattedTime (fourDigitTime) {
      var hours24 = parseInt(fourDigitTime.substring(0, 2))
      var hours = ((hours24 + 11) % 12) + 1
      var amPm = hours24 > 11 ? 'pm' : 'am'
      var minutes = fourDigitTime.substring(2)
      return hours + ':' + minutes + amPm
    }
  }
}
</script>
