import Vue from 'vue'
import $ from 'jquery'
import TourListController from '../../api/TourListController'

var controller = new TourListController()

const TourList = {
  state: {
    tags: [],
    microData: {},
    cityData: {},
    tour: {},
    initValues: {},
    compareTag: {},
    compareDetail: {},
    upcoming_tours: [],
    guideProfile: {},
    carts: [],
    discounts: [],
    confirmedCarts: [],
    confirmedDiscounts: [],
    tempCart: {},
    cartComplete: null,
    booking_id: null,
    confirmed_booking_id: null,
    applied_promo: null,
    reviews: [],
    reviewStatus: {},
    breadCrumbs: {},
    currencyConvertedProductTotals: {},
    currencyConvertedSubTotals: {},
    context: {}
  },
  actions: {
    getListContent: (context, payload) => {
      return new Promise((resolve, reject) => {
        controller.getListContent(payload.city).then(data => {
          context.commit('setTags', data)
          resolve()
        }, error => reject(error))
      })
    },
    getListMicroData: (context, payload) => {
      return new Promise((resolve, reject) => {
        controller.getListMicroData(payload).then(data => {
          context.commit('setMicroData', data)
          resolve()
        }, error => reject(error))
      })
    },
    getListCityData: (context, payload) => {
      return new Promise((resolve, reject) => {
        controller.getListCityData(payload).then(data => {
          context.commit('setCityData', data)
          resolve()
        }, error => reject(error))
      })
    },
    getBreadCrumbs: (context, payload) => {
      return new Promise((resolve, reject) => {
        controller.buildBreadCrumbs(payload).then(data => {
          context.commit('setBreadCrumbs', data)
          resolve()
        }, error => reject(error))
      })
    },
    getAvailability: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        controller.getAvailability(payload.eventID, payload.startDate, payload.endDate).then(data => {
          // commit('setTags', data)
          resolve()
        }, error => reject(error))
      })
    },
    checkReserved: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        controller.checkReserved(payload).then(data => {
          var newstageIdsTemp = []
          if (data.redFlag) {
            Vue.localStorage.set('stageIdsTemp', JSON.stringify(newstageIdsTemp))
            state.booking_id = null
            state.carts = []
            state.cartComplete = null
            Vue.localStorage.remove('BookingID')
            Vue.localStorage.remove('Carts')
            Vue.localStorage.remove('Discounts')
            setTimeout(function () {
              $('.complete_booking').remove()
              $('.error-message-booking').html('There is an issue with your booking. Please contact customer service.').stop(1, 1).fadeIn()
            }, 500)
          }
          for (var i = 0; i < data.indexList.length; i++) {
            var index = data.indexList[0]
            if (index > -1) {
              newstageIdsTemp = JSON.parse(Vue.localStorage.get('stageIdsTemp'))
              newstageIdsTemp.splice(index, 1)
              Vue.localStorage.set('stageIdsTemp', JSON.stringify(newstageIdsTemp))
              state.carts.splice(index, 1)
              state.discounts.splice(index, 1)
            }
            if (state.carts.length === 0) {
              newstageIdsTemp = []
              Vue.localStorage.set('stageIdsTemp', JSON.stringify(newstageIdsTemp))
              state.booking_id = null
              state.carts = []
              state.cartComplete = null
              Vue.localStorage.remove('BookingID')
              Vue.localStorage.remove('Carts')
              Vue.localStorage.remove('Discounts')
            } else {
              Vue.localStorage.set('Carts', JSON.stringify(state.carts))
            }
          }
          resolve(data.redFlag)
        }, error => reject(error))
      })
    },
    getTour: (context, payload) => {
      return new Promise((resolve, reject) => {
        controller.getTour(payload.city, payload.tour).then(data => {
          var setTourPayload = {
            'tour': data.tour,
            'availability': data.availability
          }
          context.commit('setTour', setTourPayload)
          // calls setAvailability mutator of this page
          context.commit('setAvailability', data.availability)
          context.commit('setMaxMonth', data.calendarSetup.maxMonth)
          // calls setcalendarSetup mutator of this page
          context.commit('setcalendarSetup', data.calendarSetup)
          resolve()
        }, error => reject(error))
      })
    },
    getTourReviews: (context, payload) => {
      return new Promise((resolve, reject) => {
        controller.getTourReviews(payload.eventId, payload.offset, payload.limit).then(reviews => {
          context.commit('setReviews', reviews)
          resolve(reviews)
        }, error => reject(error))
      })
    },
    getTourReviewStatus: (context, payload) => {
      return new Promise((resolve, reject) => {
        controller.getTourReviewStatus(payload.eventId).then(reviewsStatus => {
          context.commit('setReviewStatus', reviewsStatus)
          resolve(reviewsStatus)
        }, error => reject(error))
      })
    },
    getCompareTag: (context, payload) => {
      return new Promise((resolve, reject) => {
        controller.getTag(payload.slug).then(data => {
          context.commit('setCompareTag', data)
          resolve()
        }, error => reject(error))
      })
    },
    getCompareDetail: (context, payload) => {
      return new Promise((resolve, reject) => {
        controller.getCompareDetail(payload.slug, payload.selectedTours).then(data => {
          context.commit('setCompareDetail', data)
          resolve()
        }, error => reject(error))
      })
    },
    getGuideProfile: (context, payload) => {
      return new Promise((resolve, reject) => {
        controller.getGuideProfile(payload.name).then(data => {
          context.commit('setGuideProfile', data)
          resolve()
        }, error => reject(error))
      })
    },
    addCart: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        if (state.carts.length > 0 && state.carts.indexOf(payload) > -1) {
          resolve()
          return
        }
        if (state.booking_id === null && Vue.localStorage.get('BookingID') && state.cartComplete !== null) {
          commit('setBookingID', Vue.localStorage.get('BookingID'))
        }
        controller.addCart(state.booking_id, payload).then(data => {
          if (data.length > 0) {
            var bookingID = data[0].booking_id
            commit('setBookingID', bookingID)
            commit('addCart', payload)
            commit('setCartComplete', false)
            Vue.localStorage.set('BookingID', bookingID)
            resolve()
          } else {
            reject(new Error('Empty Cart'))
          }
        }, error => reject(error))
      })
    },
    setTempCart: (context, payload) => {
      context.commit('setTempCart', payload)
    },
    removeCart: (context, payload) => {
      return new Promise((resolve, reject) => {
        var bookindId = Vue.localStorage.get('BookingID')
        context.commit('removeCart', payload)
        console.log(payload)
        controller.removeCart(payload.staging_id, bookindId).then(data => {
        }, error => {
          reject(error)
        })
      })
    },
    removeOptionCart: (context, payload) => {
      return new Promise((resolve, reject) => {
        var bookindId = Vue.localStorage.get('BookingID')
        payload.context = context
        context.commit('removeOptionCart', payload)

        controller.removeOptionCart(payload.stageId, bookindId).then(data => {
        }, error => {
          reject(error)
        })
      })
    },
    applyPromo: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        controller.applyPromo(state.booking_id, payload).then(data => {
          commit('setAppliedPromo', true)
          commit('setDiscounts', data)
          resolve(data)
        }, error => {
          commit('setAppliedPromo', false)
          reject(error)
        })
      })
    },
    initializeBooking: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        var info = payload
        if (state.booking_id !== null && state.booking_id !== undefined) {
          info.booking_id = state.booking_id
        }
        controller.bookInitialize(info).then((data) => {
          var expired = false
          commit('setBookingID', data.bookingID)
          Vue.localStorage.set('BookingID', data.bookingID)
          // stageIdsTemp is set in checkReserved of TourList.js
          if (JSON.parse(Vue.localStorage.get('stageIdsTemp')).join().split(',').length !== data.stageIds.length) {
            expired = true
          } else {
            expired = false
          }
          resolve(expired)
        }, error => {
          reject(error)
        })
      })
    },
    finalizeBooking: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        var info = payload
        if (state.booking_id === null || state.booking_id === undefined) {
          reject(new Error('Booking is not initialized'))
        } else {
          info.booking_id = state.booking_id
          controller.bookFinalize(info).then(() => {
            state.confirmed_booking_id = state.booking_id
            state.confirmedCarts = state.carts
            state.confirmedDiscounts = state.discounts
            resolve()
          }, error => {
            reject(error)
          })
        }
      })
    },
    getCollateral: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        controller.getCollateral().then(() => {
          state.confirmed_booking_id = state.booking_id
          state.confirmedCarts = state.carts
          state.confirmedDiscounts = state.discounts
          Vue.localStorage.remove('Discounts')
          commit('setBookingID', null)
          commit('removeAllCarts')
          commit('setCartComplete', true)
          resolve()
        }, error => {
          Vue.localStorage.remove('stageIdsTemp')
          state.booking_id = null
          state.carts = []
          state.cartComplete = null
          Vue.localStorage.remove('BookingID')
          Vue.localStorage.remove('Carts')
          Vue.localStorage.remove('Discounts')
          reject(error)
        })
      })
    },
    wowovoucher: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        var info = payload
        controller.wowovoucher(info).then(() => {
          resolve()
        }, error => {
          reject(error)
        })
      })
    },
    confirmationEmail: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        var info = payload
        controller.confirmationEmail(info).then(() => {
          Vue.localStorage.remove('Carts')
          resolve()
        }, error => {
          reject(error)
        })
      })
    },
    bookingDetailIds: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {
        var id = payload
        controller.bookingDetailIds(id).then(() => {
          resolve()
        }, error => {
          reject(error)
        })
      })
    },
    tourAvailability: (context, payload) => {
      return new Promise((resolve, reject) => {
        // calls getAvailability on TourListController.js
        // console.log(payload)
        controller.getAvailability(payload.product_locator, payload.firstDate, payload.lastDate)
          .then(response => {
            var newAvailability = JSON.parse(response)

            var existingAvailability = JSON.parse(context.state.availability)

            // if there is no existing availability set it to be the new availability
            if (existingAvailability.length === 0) {
              existingAvailability = newAvailability
            } else {
              // loop through the availability response and add them to the existing availability object
              for (var key in newAvailability) {
                // KASSIM added "products" index. was previously existingAvailability[key], changed to existingAvailability.products[key]
                // this is because existingAvailability now has the additional properties I mentioned above
                existingAvailability[key] = newAvailability[key]
              }
            }
            context.commit('setAvailability', JSON.stringify(existingAvailability))
            resolve()
          })
      })
    },
    calculatePackageCurrencyConvertedTotals: (context, payload) => {
      var baseTourPrices = payload.baseTourPrices // this.tour.price. The base prices of the tour
      var packageContents = payload.packageContents // this.selectedTime.product. All of the components of a tour
      var selectedOptions = payload.selectedOptions // array of product_map_id's that have been added to the tour
      var paxCounts = payload.paxCounts

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
      context.commit('setCurrencyConvertedProductTotals', newPrices)
    },
    calculateEventCurrencyConvertedTotals: (context, payload) => {
      var baseTourPrices = payload.baseTourPrices
      var paxCounts = payload.paxCounts
      // baseTourPrices, paxCounts

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
      // return newPrices
      context.commit('setCurrencyConvertedProductTotals', newPrices)
    },
    calculateCurrencyConvertedSubTotals: (context, payload) => {
      var currencyConvertedTotals = payload
      var subtotals = { 'AUD': 0.00, 'CAD': 0.00, 'EUR': 0.00, 'GBP': 0.00, 'TRY': 0.00, 'USD': 0.00 }
      var currencies = Object.keys(subtotals)
      var paxTypes = Object.keys(currencyConvertedTotals) // array of "adults_price", "students_price", etc...

      for (var i = 0; i < paxTypes.length; i++) {
        for (var j = 0; j < currencies.length; j++) {
          subtotals[currencies[j]] = (parseFloat(subtotals[currencies[j]]) + parseFloat(currencyConvertedTotals[paxTypes[i]][currencies[j]])).toFixed(2)
        }
      }
      // return subtotals
      context.commit('setCurrencyConvertedSubTotals', subtotals)
    }
  },
  mutations: {
    setContext: (state, data) => {
      state.context = data
    },
    setTags: (state, data) => {
      state.tags = data
      if (window._didAsyncInjectGoogleAnalytics) {
        var tourSlugs = []
        for (var tourIndex in state.tags[0].tours) {
          tourSlugs.push(state.tags[0].tours[tourIndex].event_id)
        }
        if (tourSlugs.length === 2) {
          tourSlugs.push('')
        }
        if (tourSlugs.length === 1) {
          tourSlugs.push('')
          tourSlugs.push('')
        }
        if (tourSlugs.length === 0) {
          tourSlugs.push('')
          tourSlugs.push('')
          tourSlugs.push('')
        }
        window.dataLayer.push({
          'event': 'CriteoListing',
          'PageType': 'ListingPage',
          'setAccount': Vue.localStorage.get('CriteoID'),
          'setSiteType': Vue.localStorage.get('deviceType'),
          'setHashedEmail': [''],
          'viewList': tourSlugs.slice(0, 3)
        })
      }
    },
    setMicroData: (state, data) => {
      state.microData = data
    },
    setCityData: (state, data) => {
      state.cityData = data
    },
    setBreadCrumbs: (state, data) => {
      state.breadCrumbs = data
    },
    setTour: (state, data) => {
      state.tour = data.tour
      state.initValues = {
        dates_group: data.availability,
        first_group: {
          year: (new Date()).getFullYear(),
          month: (new Date()).getMonth()
        },
        group_prices: data.tour.price,
        discount: data.tour.discount,
        events_id: data.tour.eventID
      }
    },
    setReviews: (state, data) => {
      state.reviews = data
    },
    setReviewStatus: (state, data) => {
      state.reviewStatus = data
    },
    setCompareTag: (state, data) => {
      state.compareTag = data
    },
    setCompareDetail: (state, data) => {
      state.compareDetail = data
    },
    setUpcomingTours: (state, data) => {
      state.upcoming_tours = data
    },
    setGuideProfile: (state, data) => {
      state.guideProfile = data
    },
    setTempCart: (state, data) => {
      state.tempCart = data
    },
    addCart: (state, data) => {
      if (Vue.localStorage.get('Carts')) {
        let savedCarts = JSON.parse(Vue.localStorage.get('Carts'))
        state.carts = savedCarts
      }
      if (Vue.localStorage.get('Discounts')) {
        let savedDiscounts = JSON.parse(Vue.localStorage.get('Discounts'))
        state.discounts = savedDiscounts
      }
      if (data !== null) {
        for (var index in state.carts) {
          if (data.staging_id === state.carts[index].staging_id) {
            state.carts[index] = data
            Vue.localStorage.set('Carts', JSON.stringify(state.carts))
            return
          }
        }
        state.carts.push(data)
        Vue.localStorage.set('Carts', JSON.stringify(state.carts))
      }
    },
    removeCart: (state, data) => {
      var index = state.carts.indexOf(data)
      var newstageIdsTemp = []
      if (index > -1) {
        newstageIdsTemp = JSON.parse(Vue.localStorage.get('stageIdsTemp'))
        newstageIdsTemp.splice(index, 1)
        Vue.localStorage.set('stageIdsTemp', JSON.stringify(newstageIdsTemp))
        state.carts.splice(index, 1)
        state.discounts.splice(index, 1)
      }
      if (state.carts.length === 0) {
        newstageIdsTemp = []
        Vue.localStorage.set('stageIdsTemp', JSON.stringify(newstageIdsTemp))
        state.booking_id = null
        state.carts = []
        state.cartComplete = null
        Vue.localStorage.remove('BookingID')
        Vue.localStorage.remove('Carts')
        Vue.localStorage.remove('Discounts')
      } else {
        Vue.localStorage.set('Carts', JSON.stringify(state.carts))
      }
    },
    removeOptionCart: (state, data) => {
      var index = state.carts.indexOf(data.item)
      var newstageIdsTemp = []
      if (index > -1) {
        newstageIdsTemp = JSON.parse(Vue.localStorage.get('stageIdsTemp'))
        newstageIdsTemp[index].splice(data.optionIndex, 1)
        state.carts[index].productLocatorOptionsData.splice(data.optionIndex, 1)
        state.carts[index].productLocatorOptions.splice(data.optionIndex, 1)
        state.carts[index].staging_id.splice(state.carts.indexOf(state.carts[index].staging_id), 1)

        var paxCounts = {
          adults_price: 0,
          students_price: 0,
          children_price: 0,
          infants_price: 0,
          seniors_price: 0 // TODO: verify that adults are used in place of seniors
        }

        var guests = state.carts[index].guests
        for (var i = 0; i < guests.length; i++) {
          var guestType = guests[i]['type'] + '_price'
          paxCounts[guestType] = guests[i]['count']
        }
        if (state.carts[index].productLocatorType === 'package' || state.carts[index].productLocatorOptions.length > 0) {
          var locatorOptions = []
          for (i = 0; i < state.carts[index].productLocatorOptions.length; i++) {
            locatorOptions.push(parseInt(state.carts[index].productLocatorOptions[i]))
          }
          var payload = {
            baseTourPrices: state.carts[index].price,
            packageContents: state.carts[index].packageContents,
            selectedOptions: locatorOptions,
            paxCounts: paxCounts
          }
          // this.a.actions.calculatePackageCurrencyConvertedTotals(data.context, payload)
          // payload.context.commit(calculatePackageCurrencyConvertedTotals(data.context, payload)
          data.context.dispatch('calculatePackageCurrencyConvertedTotals', payload)
          var productTotals = state.currencyConvertedProductTotals
        } else {
          payload = {
            baseTourPrices: state.carts[index].price,
            paxCounts: paxCounts
          }
          // this.a.actions.calculateEventCurrencyConvertedTotals(data.context, payload)
          data.context.dispatch('calculateEventCurrencyConvertedTotals', payload)
          productTotals = state.currencyConvertedProductTotals
        }
        state.carts[index].totalPrice = productTotals
        // this.a.actions.calculateCurrencyConvertedSubTotals(data.context, productTotals)
        data.context.dispatch('calculateCurrencyConvertedSubTotals', productTotals)
        var subtotals = state.currencyConvertedSubTotals
        state.carts[index].subTotals = subtotals

        Vue.localStorage.set('stageIdsTemp', JSON.stringify(newstageIdsTemp))
      }
      Vue.localStorage.set('Carts', JSON.stringify(state.carts))
    },
    setBookingID: (state, data) => {
      state.booking_id = data
    },
    setConfirmedBookingID: (state, data) => {
      state.confirmed_booking_id = data
    },
    removeConfirmedCarts: (state) => {
      state.confirmedCarts = []
      state.confirmedDiscounts = []
    },
    removeAllCarts: (state) => {
      state.carts = []
      state.discounts = []
    },
    setAppliedPromo: (state, data) => {
      state.applied_promo = data
    },
    setCartComplete: (state, data) => {
      state.cartComplete = data
    },
    setDiscounts: (state, data) => {
      state.discounts = data
      Vue.localStorage.set('Discounts', JSON.stringify(data))
    },
    setAvailability: (state, data) => {
      var availability = JSON.parse(data)
      delete availability.tour_id
      state.availability = JSON.stringify(availability)
    },
    setcalendarSetup: (state, data) => {
      state.calendarSetup = {minMonth: data.minMonth, maxMonth: data.maxMonth}
      // the data object also contains the selectedMonth property
      state.selectedMonth = data.selectedMonth
    },
    setMinMonth: (state, data) => {
      state.minMonth = data
    },
    setMaxMonth: (state, data) => {
      state.maxMonth = data
    },
    setselectedMonth: (state, data) => {
      state.selectedMonth = data
    },
    setCurrencyConvertedProductTotals: (state, data) => {
      state.currencyConvertedProductTotals = data
    },
    setCurrencyConvertedSubTotals: (state, data) => {
      state.currencyConvertedSubTotals = data
    }
  },
  getters: {
    tags: state => {
      return state.tags
    },
    microData: state => {
      return state.microData
    },
    cityData: state => {
      return state.cityData
    },
    breadCrumbs: state => {
      return state.breadCrumbs
    },
    tour: state => {
      return state.tour
    },
    reviews: state => {
      return state.reviews
    },
    reviewStatus: state => {
      return state.reviewStatus
    },
    compareTag: state => {
      return state.compareTag
    },
    compareDetail: state => {
      return state.compareDetail
    },
    upcoming_tours: state => {
      return state.upcoming_tours
    },
    guideProfile: state => {
      return state.guideProfile
    },
    initValues: state => {
      return state.initValues
    },
    carts: state => {
      return state.carts
    },
    confirmedCarts: state => {
      return state.confirmedCarts
    },
    confirmedDiscounts: state => {
      return state.confirmedDiscounts
    },
    tempCart: state => {
      return state.tempCart
    },
    booking_id: state => {
      return state.booking_id
    },
    confirmed_booking_id: state => {
      return state.confirmed_booking_id
    },
    applied_promo: state => {
      return state.applied_promo
    },
    cartComplete: state => {
      return state.cartComplete
    },
    discounts: state => {
      return state.discounts
    },
    getCurrencyConvertedProductTotals: state => {
      return state.currencyConvertedProductTotals
    },
    getCurrencyConvertedSubTotals: state => {
      return state.currencyConvertedSubTotals
    }
  }
}

export default TourList
