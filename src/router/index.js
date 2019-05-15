import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import HomePage from '@/pages/HomePage'
import UpcomingToursPage from '@/pages/UpcomingToursPage'
import PastToursPage from '@/pages/PastToursPage'
import WishListPage from '@/pages/WishListPage'
import SettingsPage from '@/pages/SettingsPage'
import ToursPage from '@/pages/ToursPage'
import TourDetailPage from '@/pages/TourDetailPage'
import PaymentPage from '@/pages/PaymentPage'
import BookConfirmPage from '@/pages/BookConfirmPage'
import CancellationPolicy from '@/pages/CancellationPolicy'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import CookiesPolicy from '@/pages/CookiesPolicy'
import TermsPage from '@/pages/TermsPage'
import CareerPage from '@/pages/CareerPage'
import ContactPage from '@/pages/ContactPage'
import GuideProfile from '@/pages/GuideProfile'
import ReviewsPage from '@/pages/ReviewsPage'
import ComparePage from '@/pages/ComparePage'
import store from '../store/index'
import VueLocalStorage from 'vue-localstorage'
import $ from 'jquery'
// const HomePage = () => import('@/pages/HomePage')
// const UpcomingToursPage = () => import('@/pages/UpcomingToursPage')
// const PastToursPage = () => import('@/pages/PastToursPage')
// const WishListPage = () => import('@/pages/WishListPage')
// const SettingsPage = () => import('@/pages/SettingsPage')
// const ToursPage = () => import('@/pages/ToursPage')
// const TourDetailPage = () => import('@/pages/TourDetailPage')
// const PaymentPage = () => import('@/pages/PaymentPage')
// const BookConfirmPage = () => import('@/pages/BookConfirmPage')
// const CancellationPolicy = () => import('@/pages/CancellationPolicy')
// const PrivacyPolicy = () => import('@/pages/PrivacyPolicy')
// const TermsPage = () => import('@/pages/TermsPage')
// const CareerPage = () => import('@/pages/CareerPage')
// const ContactPage = () => import('@/pages/ContactPage')
// const GuideProfile = () => import('@/pages/GuideProfile')
// const ReviewsPage = () => import('@/pages/ReviewsPage')
// const ComparePage = () => import('@/pages/ComparePage')

Vue.use(Router)
Vue.use(Meta)
Vue.use(VueLocalStorage)

if (!Vue.localStorage.get('lastCleared') || new Date() >= new Date(Vue.localStorage.get('lastCleared')).setDate(new Date(Vue.localStorage.get('lastCleared')).getDate() + 1)) {
  localStorage.clear()
  Vue.localStorage.set('lastCleared', new Date())
}
var loadCompareTag = (to, from, next) => {
  store.dispatch('getCompareTag', {slug: to.params.slug + '-compare'}).then(() => {
    next()
  })
}

var redirectNonAuth = (to, from, next) => {
  if (store.getters.isLogged) {
    next()
  } else {
    store.dispatch('logout').then(() => {
      router.push('/')
    })
  }
}

var redirectHomePage = (to, from, next) => {
  if (store.getters.cartComplete === true) {
    store.commit('setCartComplete', null)
    next()
  } else {
    router.push('/')
  }
}
var checkReserved = (to, from, next) => {
  if (Vue.localStorage.get('BookingID')) {
    store.dispatch('checkReserved', Vue.localStorage.get('BookingID')).then((redFlag) => {
      next()
    })
  }
}

var loadTourDetail = (to, from, next) => {
  Vue.prototype.$Progress.start()
  store.dispatch('getTour', {city: to.params.city, tour: to.params.slug}).then(() => {
    Vue.prototype.$Progress.finish()
    next()
  })
}

var loadTourReviews = (to, from, next) => {
  if (store.state.TourList.tour.tourSlug !== undefined && store.state.TourList.tour.tourSlug === to.params.slug) {
    Vue.prototype.$Progress.start()
    store.dispatch('getTourReviews', {eventId: store.state.TourList.tour.eventID, offset: 0, limit: 10}).then(() => {
      Vue.prototype.$Progress.finish()
      next()
    }, error => {
      console.log(error)
      Vue.prototype.$Progress.fail()
    })
  } else {
    Vue.prototype.$Progress.start()
    store.dispatch('getTour', {city: to.params.city, tour: to.params.slug}).then(() => {
      store.dispatch('getTourReviews', {eventId: store.state.TourList.tour.eventID, offset: 0, limit: 10}).then(() => {
        // store.dispatch('getTourReviewStatus', {eventId: store.state.TourList.tour.eventID}).then(() => {
        Vue.prototype.$Progress.finish()
        next()
        // })
      })
    })
  }
}

var loadGuideProfile = (to, from, next) => {
  Vue.prototype.$Progress.start()
  store.dispatch('getGuideProfile', {name: to.params.name}).then(() => {
    Vue.prototype.$Progress.finish()
    next()
  })
}

// var checkCart = (to, from, next) => {
//   store.dispatch('checkCart').then(() => {
//     next()
//   }, error => {
//     store.commit('setStatus', {
//       type: 'error',
//       message: error.message
//     })
//   })
// }

var bFirstLoad = true
var loadHomeContent = (to, from, next) => {
  store.commit('setAllLoaded', false)
  Vue.prototype.$Progress.start()
  if (bFirstLoad) {
    store.dispatch('getHomeData').then(() => {
      bFirstLoad = false
      Vue.prototype.$Progress.finish()
      store.commit('setAllLoaded', true)
      next()
    })
  } else {
    Vue.prototype.$Progress.finish()
    store.commit('setAllLoaded', true)
    next()
  }
}

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
      beforeEnter: loadHomeContent
    },
    {
      path: '/:city' + '-tours' + '/:slug' + '-compare',
      name: 'ComparePage',
      component: ComparePage,
      beforeEnter: loadCompareTag
    },
    {
      path: '/:city' + '-tours',
      name: 'ToursPage',
      component: ToursPage
    },
    {
      path: '/cancellation-policy',
      name: 'CancellationPolicy',
      component: CancellationPolicy
    },
    {
      path: '/privacy-policy',
      name: 'PrivacyPolicy',
      component: PrivacyPolicy
    },
    {
      path: '/Cookies-policy',
      name: 'CookiesPolicy',
      component: CookiesPolicy
    },
    {
      path: '/terms',
      name: 'TermsPage',
      component: TermsPage
    },
    {
      path: '/careers',
      name: 'CareerPage',
      component: CareerPage
    },
    {
      path: '/contact',
      name: 'ContactPage',
      component: ContactPage
    },
    {
      path: '/guide/:name',
      name: 'GuideProfile',
      component: GuideProfile,
      beforeEnter: loadGuideProfile
    },
    {
      path: '/:city' + '-tours' + '/:slug',
      name: 'TourDetailPage',
      component: TourDetailPage,
      beforeEnter: loadTourDetail
    },
    {
      path: '/account',
      name: 'UpcomingToursPage',
      component: UpcomingToursPage,
      beforeEnter: redirectNonAuth
    },
    {
      path: '/past_tours',
      name: 'PastToursPage',
      component: PastToursPage,
      beforeEnter: redirectNonAuth
    },
    {
      path: '/wishlist',
      name: 'WishListPage',
      component: WishListPage,
      beforeEnter: redirectNonAuth
    },
    {
      path: '/settings',
      name: 'SettingsPage',
      component: SettingsPage,
      beforeEnter: redirectNonAuth
    },
    {
      path: '/payment',
      name: 'PaymentPage',
      component: PaymentPage,
      beforeEnter: checkReserved
    },
    {
      path: '/confirm',
      name: 'BookConfirmPage',
      component: BookConfirmPage,
      beforeEnter: redirectHomePage
    },
    {
      path: '/:city' + '-tours' + '/:slug' + '/reviews',
      name: 'ReviewsPage',
      component: ReviewsPage,
      beforeEnter: loadTourReviews
    }
  ]
})

router.beforeEach((to, from, next) => {
  var $sidebar = $('.sidebar.active')
  $sidebar.removeClass('active').hide()
  if (from.path === '/confirm') {
    Vue.localStorage.remove('BookingID')
    Vue.localStorage.remove('Carts')
    store.commit('setConfirmedBookingID', null)
    store.commit('removeConfirmedCarts')
  }

  $('.flashMessage').slideUp(function () {
    store.commit('setStatus', 'none')
    $('.flashMessage').removeAttr('style')
  })
  next()
})

export default router
