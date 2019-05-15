<template>
  <div class="city-tours-header">
    <div class="container">
      <img v-if="this.checkPromo()" src="../../assets/img/blackfriday.jpg" alt="blackfriday" class="blackfriday" style="margin: 0 auto; margin-top: 90px;">
      <div v-if="this.checkPromo()" class="city-tour-title" style="padding-top: 10px;">
        <h1 class="page-title black">{{ cityname }}</h1>
      </div>
      <div v-if="!this.checkPromo()" class="city-tour-title">
        <h1 class="page-title black">{{ cityname }}</h1>
      </div>
      <div class="tabs city-tour-tabs" v-if="tagnames.length && tagnames.length>1">
        <a 
          v-for="(tagName, index) in tagnames"
          v-bind:key="index"
          class="tab-item city-tour-tab"
          :href="getTagReference(index)"
        >
          {{ tagName }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>

import $ from 'jquery'
import store from '../../store'
import DatePicker from '@/components/DatePicker'

export default {
  name: 'CityTourHeader',
  components: {
    DatePicker
  },
  props: {
    cityname: {
      type: String,
      required: true
    },
    tagnames: {
      type: Array,
      required: true
    }
  },
  mounted () {
    $(window).scroll(function () {
      // if (this.tagnames && this.tagnames.length > 1) { return }
      let top = $(window).scrollTop()
      let $tofix = $('.city-tours-header')
      let w = $(window).width()
      if (w >= 1024) {
        if ($tofix.length) {
          if (top > $tofix.offset().top && !$tofix.hasClass('compact')) {
            $tofix.addClass('compact')
            $('.blackfriday').hide()
          }
          if (top < 140) {
            $tofix.removeClass('compact')
            $('.blackfriday').show()
            // top < $tofix.offset().top
          }
        }
      }
    })
    // if (this.tagnames && this.tagnames.length > 1) {
    this.scrollToItem()
    this.scrollToSpy()
    // }
  },
  methods: {
    checkPromo () {
      if (process.env.PROMOCODE !== undefined) {
        return true
      } else {
        return false
      }
    },
    getTagReference (index) {
      let preStr = this.tagnames[index].replace(/[^\w\s]/gi, '').toLowerCase()
      return '#tag-' + preStr.replace(new RegExp(' ', 'g'), '-').toLowerCase()
    },
    dateSearch () {
      let startDate = $('input[name=start_date]').datepick('getDate')[0].toISOString().split('T')[0]
      let endDate = $('input[name=end_date]').datepick('getDate')[0].toISOString().split('T')[0]
      store.dispatch('getAvailability', {
        startDate: startDate,
        endDate: endDate
      })
    },
    getCitySlug () {
      let words = this.cityname.toLowerCase().split(' ')
      var slug = ''
      for (var i = 0; i < words.length - 1; i++) {
        slug += words[i]
        if (i !== words.length - 2) {
          slug += '-'
        }
      }
      return slug
    },
    scrollToItem () {
      let $a = $('.city-tour-tabs .tab-item')
      $a.click(function () {
        // if (this.tagnames && this.tagnames.length > 1) { return }
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
        // console.log('scrolll....')
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

