<template>
  <div>
    <Hero />
    <LocalGuides />
    <PopularDest />
    <Features />
    <StaffPicker />
    <recommended />
    <SignupForm />
  </div>
</template>

<script>

import $ from 'jquery'
import Hero from '@/containers/home/Hero'
import LocalGuides from '@/containers/home/LocalGuides'
import PopularDest from '@/containers/home/PopularDest'
import Features from '@/containers/home/Features'
import StaffPicker from '@/containers/home/StaffPicker'
import Recommended from '@/containers/home/Recommended'
import SignupForm from '@/containers/home/SignupForm'
import { mapGetters } from 'vuex'
import store from '../store'
import Vue from 'vue'

export default {
  name: 'HomePage',
  components: {
    Hero,
    LocalGuides,
    PopularDest,
    Features,
    StaffPicker,
    Recommended,
    SignupForm
  },
  computed: {
    ...mapGetters([
      'organizationMicroData',
      'websiteMicroData',
      'homepageMetaTitle',
      'homepageMetaDescription'
    ])
  },
  metaInfo () {
    return {
      title: this.homepageMetaTitle !== undefined ? this.homepageMetaTitle : '',
      meta: [
        {
          'property': 'og:title',
          'content': this.homepageMetaTitle !== undefined ? this.homepageMetaTitle : ''
        },
        {
          'property': 'og:description',
          'content': this.homepageMetaDescription !== undefined ? this.homepageMetaDescription : ''
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
          content: this.homepageMetaDescription !== undefined ? this.homepageMetaDescription : ''
        }
      ],
      script: [
        { innerHTML: this.getOrganizationMicroData(),
          type: 'application/ld+json'
        },
        { innerHTML: this.getWebsiteMicroData(),
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
  mounted () {
    $('#launcher').removeClass('launcher-detail')
    this.backToTop()
    document.dispatchEvent(new Event('render-event'))
    store.dispatch('getOrganizationMicroData')
    store.dispatch('getWebsiteMicroData')
    setTimeout(document.dispatchEvent(new Event('render-event')), 5000)
    if (window._didAsyncInjectGoogleAnalytics) {
      window.dataLayer.push({
        'event': 'CriteoHome',
        'PageType': 'viewHome',
        'setAccount': Vue.localStorage.get('CriteoID'),
        'setSiteType': Vue.localStorage.get('deviceType'),
        'setHashedEmail': ['']
      })
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
    getOrganizationMicroData () {
      return this.organizationMicroData
    },
    getWebsiteMicroData () {
      return this.websiteMicroData
    },
    getMetaURL () {
      return Vue.url.options.root
    }
  }
}
</script>
