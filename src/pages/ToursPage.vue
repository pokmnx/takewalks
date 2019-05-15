<template>
  <div>
    <CityTourHeader
      :cityname="getCityName()"
      :tagnames="getTagNameArray()"
    />
    <div class="tour-list-wrap">
      <TourTagSection
        v-for="tag in tags"
        v-bind:key="tag.name"
        :tag="tag"
      />
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import $ from 'jquery'
import Vue from 'vue'
import CityTourHeader from '@/containers/tour/CityTourHeader'
import TourTagSection from '@/containers/tour/TourTagSection'
import store from '../store'

export default {
  name: 'ToursPage',
  components: {
    CityTourHeader,
    TourTagSection
  },
  computed: {
    ...mapGetters([
      'tags',
      'microData',
      'cityData',
      'breadCrumbs'
    ])
  },
  metaInfo () {
    return {
      title: (this.cityData !== undefined && this.cityData !== null) ? this.cityData.cityListingMetaTitle : '',
      meta: [
        {
          'property': 'og:title',
          'content': this.cityData !== undefined ? this.cityData.cityListingMetaTitle : ''
        },
        {
          'property': 'og:description',
          'content': this.cityData !== undefined ? this.cityData.cityListingMetaDescription : ''
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
          content: this.cityData !== undefined ? this.cityData.cityListingMetaDescription : ''
        }
      ],
      script: [
        { innerHTML: this.getMicroData(),
          type: 'application/ld+json'
        },
        { innerHTML: this.getBreadCrumbs(),
          type: 'application/ld+json'
        }
      ],
      link: [
        { 'rel': 'canonical',
          'href': this.getMetaURL()
        }
      ]
    }
  },
  data () {
    return {
      badges: [
        {
          name: 'Gold',
          description: 'Gold tours are our most special, exclusive experiences - perfect for guests planning the trip of a lifetime. Each gold tour has unique or VIP access or a luxury itinerary you won&#39;t get anywhere else.',
          tooltip: 'Gold tours have VIP access or a unique luxury itinerary.'
        },
        {
          name: 'Silver',
          description: 'Most of our tours are silver status, with guaranteed small groups & skip the line access. Silver tours are perfect for guests who want to go beyond the basics to get the most from their vacation.',
          tooltip: 'Silver tours have small groups & skip the line access, guaranteed.'
        },
        {
          name: 'Bronze',
          description: 'Our most affordable tours compromise on group size (up to 25) to keep prices low, but never on the quality of your tour guide. Bronze tours are a great choice for families, large groups or budget-conscious travelers.',
          tooltip: 'Our most affordable tours compromise on group size (up to 25), not quality.'
        }
      ]
    }
  },
  beforeRouteUpdate: (to, from, next) => {
    if (to.path !== from.path) {
      Vue.prototype.$Progress.start()
      store.dispatch('getListContent', {
        city: to.params.city,
        startDate: null,
        endDate: null
      }).then(() => {
        store.dispatch('getListMicroData', to.params.city)
        store.dispatch('getListCityData', to.params.city)
        Vue.prototype.$Progress.finish()
        next()
      }, error => {
        console.log(error)
        Vue.prototype.$Progress.fail()
      })
    }
  },
  beforeRouteEnter: (to, from, next) => {
    Vue.prototype.$Progress.start()
    store.dispatch('getListContent', {
      city: to.params.city,
      startDate: null,
      endDate: null
    }).then(() => {
      store.dispatch('getListMicroData', to.params.city)
      store.dispatch('getListCityData', to.params.city)
      Vue.prototype.$Progress.finish()
      next()
    }, error => {
      console.log(error)
      Vue.prototype.$Progress.fail()
    })
  },
  mounted () {
    $('#launcher').removeClass('launcher-detail')
    $('.reset-calendar').on('click', function (event) {
      $('input[name=start_date]').datepick('setDate', new Date())
      $('input[name=end_date]').val('')
      $('input[name=end_date]').closest('.input-icon').find('.icon-checkmark_circled').remove()
      $('input[name=end_date]').closest('.input-icon').removeClass('valid')
    })
    $('input[name=start_date]').datepick('setDate', new Date())
    $('html, body').animate({scrollTop: 0}, 400)
    this.buildBreadCrumbs()
    setTimeout(document.dispatchEvent(new Event('render-event')), 5000)
  },
  updated () {
    this.scrollToItem()
    this.scrollToSpy()
  },
  methods: {
    buildBreadCrumbs () {
      let midSlash = ''
      if (!Vue.url.options.root.match(/\/$/) && !this.$route.path.match(/^\//)) {
        midSlash = '/'
      }
      var currentPath = [
        Vue.url.options.root,
        Vue.url.options.root + midSlash + this.$route.path
      ]
      store.dispatch('getBreadCrumbs', {'urls': currentPath})
    },
    getCityName () {
      let routerName = this.$route.params.city
      let array = routerName.split('-')
      let cityName = ''
      for (let index in array) {
        cityName += array[index].substr(0, 1).toUpperCase() + array[index].substr(1) + ' '
      }
      return cityName + 'Tours'
    },
    getTagNameArray () {
      let nameArray = []
      for (let tag in this.tags) {
        nameArray.push(this.tags[tag].name)
      }
      return nameArray
    },
    getMetaURL () {
      let trailingSlash = ''
      if (!this.$route.path.match(/\/$/)) {
        trailingSlash = '/'
      }
      return Vue.url.options.root + this.$route.path + trailingSlash
    },
    getMicroData () {
      return this.microData
    },
    getBreadCrumbs () {
      return this.breadCrumbs
    },
    scrollToItem () {
      let $a = $('.city-tour-tabs .tab-item')
      $a.click(function () {
        let id = $(this).attr('href')
        let headerHeight
        headerHeight = 0

        if (!$('.city-tours-header').hasClass('compact')) {
          headerHeight = $('.city-tours-header').outerHeight()
        } else {
          headerHeight = 0
        }
        let top
        if ($(window).width() >= 1024) {
          top = $(id).offset().top - headerHeight
        } else {
          top = $(id).offset().top + 60
        }
        if (id === '#mostPopular') {
          top = 0
          if (
            $(window).scrollTop() + 200 <
            $(id).offset().top + $(id).outerHeight()
          ) {
            return false
          }
        }
        $('html, body').animate(
          {
            scrollTop: top - 60
          },
          400
        )
      })
      $('[data-scroll-toggler]').click(function () {
        let attr = $(this).attr('data-scroll-toggler')
        if (!$(this).hasClass('city-tour-tab')) {
          $('html, body').animate(
            {
              scrollTop: $('[data-scroll-target=' + attr + ']').offset().top
            },
            400
          )
        } else {
          $('html, body').animate(
            {
              scrollTop: $('[data-scroll-target=' + attr + ']').offset().top - 50
            },
            400
          )
        }
      })
    },
    scrollToSpy () {
      let lastId
      let topMenu = $('.city-tour-tabs, .city-nav-tabs:not(.my-account-tabs)')
      let topMenuHeight = topMenu.outerHeight() + 15
      // All list items
      let menuItems = topMenu.find('a')
      // Anchors corresponding to menu items
      let scrollItems = menuItems.map(function () {
        let item = $($(this).attr('href'))
        if (item.length) {
          return item
        }
      })
      // Bind to scroll
      $(window).scroll(function () {
        // Get container scroll position
        let fromTop = $(this).scrollTop() + topMenuHeight
        // Get id of current scroll item
        let cur = scrollItems.map(function () {
          if ($(this).offset().top < fromTop) return this
        })
        // Get the id of the current element
        cur = cur[cur.length - 1]
        let id = cur && cur.length ? cur[0].id : ''

        if (lastId !== id) {
          lastId = id
          // Set/remove active class
          menuItems
            .removeClass('active')
            .filter('[href=\'#' + id + '\']')
            .addClass('active')
        }
      })
    }
  }
}
</script>
