<template>
  <div class="tour-detail-content container">

    <ul class="breadcrumbs">
      <li class="active"><router-link :to="getSlugRef(tour.citySlug)"><img src="../assets/svg/breadcrumbs-arrow.svg" /><span>All {{ tour.cityName }} Tours</span></router-link></li>
    </ul>

    <div class="tour-detail-top">
      <div class="left-content">
        <div class="tour-heading">
          <h1 class="page-title page-title-detail">{{ tour.title }}</h1>
          <div class="tour-header-info">
            <div class="tour-stats tour-stats-top">
              <div class="tour-box-reviews tour-box-reviews-details" v-if="tour.reviewsCount > 1">
                <svgicon width="20" height="20" :name="getRatingIconName(tour.reviewsAverage, 1)" :class="getRatingIconClass(tour.reviewsAverage, 1)" />
                <svgicon width="20" height="20" :name="getRatingIconName(tour.reviewsAverage, 2)" :class="getRatingIconClass(tour.reviewsAverage, 2)" />
                <svgicon width="20" height="20" :name="getRatingIconName(tour.reviewsAverage, 3)" :class="getRatingIconClass(tour.reviewsAverage, 3)" />
                <svgicon width="20" height="20" :name="getRatingIconName(tour.reviewsAverage, 4)" :class="getRatingIconClass(tour.reviewsAverage, 4)" />
                <svgicon width="20" height="20" :name="getRatingIconName(tour.reviewsAverage, 4.7)" :class="getRatingIconClass(tour.reviewsAverage, 4.7)" />
                <p class="count" data-scroll-toggler="reviews"><span style="color:#443D47;">{{ tour.reviewsCount }} reviews</span></p>
              </div>
              <div class="tour-box-reviews tour-box-reviews-details" v-if="tour.reviewsCount < 2">
                <svgicon width="20" height="20" :name="getRatingIconName(5, 0)" :class="getRatingIconClass(5, 0)" />
                <svgicon width="20" height="20" :name="getRatingIconName(5, 0)" :class="getRatingIconClass(5, 0)" />
                <svgicon width="20" height="20" :name="getRatingIconName(5, 0)" :class="getRatingIconClass(5, 0)" />
                <svgicon width="20" height="20" :name="getRatingIconName(5, 0)" :class="getRatingIconClass(5, 0)" />
                <svgicon width="20" height="20" :name="getRatingIconName(5, 0)" :class="getRatingIconClass(5, 0)" />
                <p class="count count-new" ><span style="color:#443D47;">New - No reviews yet!</span></p>
              </div>
              <div class="svgicon-right svgicon-right-detail">
                <p><svgicon name="clock" class="icon icon-clock" width="23" height="23" /> <span class="text-clock" style="color:#443D47;">{{ tour.duration }}</span></p>
                <div class="sep"></div>
                <p><svgicon name="max" class="icon icon-max" width="23" height="28" /> <span class="text-max" style="color:#443D47;">Max {{ tour.maxGroupSize }}</span></p>
              </div>
            </div>
          </div>
        </div>

        <div class="fotorama fotorama-video"
            data-navwidth="100%"
            data-ratio="1600/950"
            data-width="100%"
            data-fit="cover"
            data-auto="false"
            data-arrows="true"
          >
          <a v-if="tour.video !== ''" :href="tour.video" data-video="true" data-ratio="1600/953" data-width="100%">
            <img v-if="tour.videoThumbnail !== ''" :src="getImageURL(tour.videoThumbnail)" alt="">
          </a>
          <img v-if="tour.video == ''" :src="getImageURL(tour.videoThumbnail)"  alt="">
        </div>

        <h2 class="intro-title">{{tour.introTitle}}</h2>
        <span class="dscr-detail">
          <p class="descr single" v-html="stripTags(tour.intro)"></p> <!-- stripTags method removes all markup from API response as it was generating extra <p></p> tags -->
        </span>

        <section  v-if="tour.highlights.length > 0" class="highlights-section">
          <div class="highlights-title tour-description-heading">
            <h2 class="highlights-title-heading">Highlights</h2>
          </div>
          <div class="highlights-content" v-html="tour.highlights">
          </div>
        </section>

        <h2 class="tour-description-heading tour-description-heading-detail">{{ tour.descriptionTitle }}</h2>
        <!-- <div v-html v-readMore:800="convertDescriptionStr(tour.description)"></div> -->
        <read-more class="decr-div decr-div-detail  decr-div-detail-mobile" more-str='Read more' :text="convertDescriptionStr(tour.description)" link="#" less-str="Read less" :max-chars="800"></read-more>
        <span class="decr-div decr-div-detail  decr-div-detail-desktop" v-html="convertDescriptionStr(tour.description)"></span>

        <div class="feature-lists feature-lists-detail">
          <ul class="feature-list feature-list-detail">
            <li class="list-title list-title-detail">Sites Visited</li>
            <li
              v-for="(site, index) in tour.sitesVisited"
              v-bind:key="index"
              class="list-detail-content"
            >
              <svgicon name="checkmark_circle" class="icon icon-checkmark_circle" />
              {{ site }}
            </li>
          </ul>
          <ul class="feature-list feature-list-detail">
            <li class="list-title list-title-detail">Tour Includes</li>
            <li
              v-for="(include, index) in tour.tourIncludes"
              v-bind:key="index"
              class="list-detail-content"
            >
              <svgicon name="checkmark_circle" class="icon icon-checkmark_circle" />
              {{ include }}
            </li>
          </ul>
        </div>

        <div class="tour-image-slider">
          <div class="fotorama fotorama-slider"
            data-navwidth="100%"
            data-ratio="1600/950"
            data-width="100%"
            data-fit="cover"
            data-auto="false"
            data-arrows="true"
            data-click="false"
            data-allowfullscreen="native"
          >
          <img
            v-for="(image, index) in tour.gallery.slice(1)"
            v-bind:key="index"
            :src="getImageURL(image.url)"
            :data-caption="image.description"
            :alt="image.description"
          />
          </div>
        </div>

        <section data-scroll-target="reviews" class="reviews-wrapper" v-if="tour.reviewsCount > 1">
          <ReviewsRating />
          <div class="">
            <div class="section-title center lastest-reviews-wrapper">
              <i class="icon icon-verified-reviews"></i>
              <img class="latest-review-icon" src="../assets/svg/latest-reviews-icon.svg" alt="latest-reviews-icon"/>
              <h2 class="section-heading section-heading-reviews">Latest Reviews</h2>
            </div>
            <ReviewsList :counter="2" />
            <div class="center-btn none">
              <router-link :to="{path: getReviewPath()}"><button class="btn primary purple reviews-btn">SEE ALL REVIEWS</button></router-link>
            </div>
          </div>
        </section>
        
      </div>
      <BookForm />
    </div>
    <section v-if="tour.faqs.length > 0" :class="this.getSimilarToursClass() + ' faq-section faq-section-detail'" style="padding-top:0px;" >
      <div class="section-sep-heading section-sep-heading-detail">
        <img src="../assets/svg/faq-icon.svg" class="faq-icon">
        <br>
        <h2 class="heading faq-heading">FAQ</h2>
      </div>
      <div class="faq-section section bordered faq-section-inner">
        <FaqItem
          v-for="(faq, index) in tour.faqs"
          v-bind:key="index"
          :question="faq.question"
          :answer="faq.answer"
        />
      </div>
    </section>
     <div v-if="tour.similarTours.length !== 0" class="container">
      <div class="tour-type-title">
        <svgicon width="50" height="50" name="similar-tours" class="icon icon-similar-tours" />
        <h2 class="tour-list-title">Similar Tours</h2>
      </div>
      <div class="tour-list-items vertical">
        <TourContainer
          v-for="tour in tour.similarTours"
          v-bind:key="tour.name"
          :tour="tour"
          :similarView="true"
        />
      </div>
    </div>
    <ReviewModal />
  </div>
</template>

<script>

import $ from 'jquery'
import Vue from 'vue'
import DatePicker from '@/components/DatePicker'
import FaqItem from '@/components/FaqItem'
import SubjectTitle from '@/components/SubjectTitle'
import GuideBox from '@/components/GuideBox'
import TourSectionTitle from '@/components/TourSectionTitle'
import ReviewsRating from '@/components/ReviewsRating'
import ReviewsList from '@/components/ReviewsList'
import TourContainer from '@/containers/tour/TourContainer'
import BookForm from '@/containers/tour_detail/BookForm'
import ReviewModal from '@/containers/tour_detail/ReviewModal'
import { mapGetters } from 'vuex'
import ReadMore from 'vue-read-more'
import store from '../store'

Vue.use(ReadMore)

require('@/lib/fotorama.js')

export default {
  name: 'TourDetailPage',
  components: {
    DatePicker,
    FaqItem,
    SubjectTitle,
    GuideBox,
    TourSectionTitle,
    TourContainer,
    BookForm,
    ReviewModal,
    ReviewsRating,
    ReviewsList
  },
  computed: {
    ...mapGetters([
      'tour',
      'tempCart',
      'breadCrumbs'
    ])
  },
  metaInfo () {
    return {
      title: this.tour !== undefined ? this.tour.metaTitle : '',
      meta: [
        {
          'property': 'og:title',
          'content': this.tour !== undefined ? this.tour.metaTitle : ''
        },
        {
          'property': 'og:description',
          'content': this.tour !== undefined ? this.tour.metaDescription : ''
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
          'property': 'og:image',
          'content': this.tour.videoThumbnail
        },
        {
          'property': 'fb:app_id',
          'content': 1989124628036695
        },
        {
          vmid: 'description',
          name: 'description',
          content: this.tour !== undefined ? this.tour.metaDescription : ''
        }
      ],
      script: [
        { innerHTML: this.tour.microData,
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
      twitterShare: 'https://twitter.com/intent/tweet?url=$canonicalURL&amp;text=',
      facebookShare: 'https://www.facebook.com/share.php?u=',
      emailShare: 'mailto:info@walks.com?cc=info@walks.com&bcc=info@walks.com',
      counter: 2
    }
  },
  watch: {
    $route (to, from) {
      location.reload()
    }
  },
  created () {
  },
  mounted () {
    $('#launcher').addClass('launcher-detail')
    if (window._didAsyncInjectGoogleAnalytics) {
      window.dataLayer.push({
        'event': 'floodlightDetail',
        'cityName': this.tour.cityName,
        'titleShort': this.tour.shortTitle
      })
      window.dataLayer.push({
        'event': 'EC',
        'ecommerce': {
          'detail': {
            'products': [{
              'id': this.tour.eventID,
              'name': this.tour.shortTitle
            }]
          }
        }
      })
      window.dataLayer.push({
        'event': 'CriteoDetail',
        'PageType': 'ProductPage',
        'setAccount': Vue.localStorage.get('CriteoID'),
        'setSiteType': Vue.localStorage.get('deviceType'),
        'setHashedEmail': [''],
        'viewListDetail': this.tour.eventID
      })
    }
    this.scrollToItem()
    document.dispatchEvent(new Event('render-event'))
    $('.highlights-content li').wrapInner('<span class="inner-span">')
    $('.highlights-content li').prepend('<span class="pull-left"><svg width="24px" height="24px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: Sketch 49.3 (51167) - http://www.bohemiancoding.com/sketch --><desc>Created with Sketch.</desc><defs></defs><g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="highlights" fill="#58B69E"><g id="Shape"><path d="M20,25 C19.84,25 19.68,25.05 19.54,25.14 L13.89,28.91 L15.8,21.89 C15.89,21.56 15.78,21.22 15.51,21.01 L9.93,16.67 L16.67,16.67 C17.01,16.67 17.31,16.46 17.44,16.14 L20,9.74 L22.56,16.14 C22.69,16.46 22.99,16.67 23.33,16.67 L30.07,16.67 L24.49,21.01 C24.22,21.22 24.11,21.56 24.2,21.89 L26.11,28.91 L20.46,25.14 C20.32,25.05 20.16,25 20,25 Z M27.5,31.67 C27.67,31.67 27.84,31.61 27.99,31.51 C28.27,31.31 28.4,30.95 28.3,30.61 L25.95,21.98 L33.01,16.49 C33.29,16.27 33.4,15.9 33.29,15.56 C33.17,15.23 32.85,15 32.5,15 L23.9,15 L20.78,7.19 C20.52,6.56 19.48,6.56 19.23,7.19 L16.1,15 L7.5,15 C7.15,15 6.83,15.23 6.71,15.56 C6.6,15.9 6.71,16.27 6.99,16.49 L14.05,21.98 L11.7,30.61 C11.6,30.95 11.73,31.31 12.01,31.51 C12.29,31.71 12.67,31.72 12.96,31.53 L20,26.83 L27.04,31.53 C27.18,31.62 27.34,31.67 27.5,31.67 Z M20,1.67 C30.11,1.67 38.33,9.89 38.33,20 C38.33,30.11 30.11,38.33 20,38.33 C9.89,38.33 1.67,30.11 1.67,20 C1.67,9.89 9.89,1.67 20,1.67 Z M20,40 C31.03,40 40,31.03 40,20 C40,8.97 31.03,0 20,0 C8.97,0 0,8.97 0,20 C0,31.03 8.97,40 20,40 Z"></path></g></g></g></svg></span>')
    $(function () {
      $('.fotorama').fotorama()
      $('.fotorama-slider').on('fotorama:fullscreenenter fotorama:fullscreenexit', function (e, fotorama) {
        if (e.type === 'fotorama:fullscreenenter') {
          // Options for the fullscreen
          fotorama.setOptions({
            fit: 'scaledown'
          })
        } else {
          // Back to normal settings
          fotorama.setOptions({
            fit: 'cover'
          })
        }
      }).fotorama()
      // $('.fotorama__arr, .fotorama__fullscreen-icon, .fotorama__video-close, .fotorama__video-play').css('background-image', 'url(//images-cdn.walks.org/takewalks-asset/fotorama.png)')
    })
    $('.decr-div-detail-mobile span').on('click', function () {
      $('.decr-div-detail-mobile span').toggleClass('active')
    })
    $('.faq-question-title').click(function () {
      var $tar = $(this)
        .parent()
        .find('.faq-question-content')
      $tar.toggleClass('active')
      $(this)
        .parent()
        .toggleClass('active')
    })
    $('#addToWishlist').click(this.addItemToWishlist)
    $('html, body').animate({scrollTop: 0}, 400)
    this.backToTop()
    document.dispatchEvent(new Event('render-event'))
    this.buildBreadcrumbs()
    if (window.hasOwnProperty('__PRERENDER_INJECTED')) {
      if (window.__PRERENDER_INJECTED.hasOwnProperty('IS_PRERENDERING')) {
        if (window.__PRERENDER_INJECTED.IS_PRERENDERING) {
          console.log('PRERENDER ONLY!!: Clearing local storage')
          window.localStorage.clear()
        }
      }
    }
  },
  methods: {
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
    getSlugRef (slug) {
      return '/' + slug + '/'
    },
    buildBreadcrumbs () {
      let midSlash = ''
      if (!Vue.url.options.root.match(/\/$/) && !this.$route.params.city.match(/^\//)) {
        midSlash = '/'
      }
      var currentPath = [
        Vue.url.options.root,
        Vue.url.options.root + midSlash + this.$route.params.city + '-tours/',
        Vue.url.options.root + this.$route.path
      ]
      store.dispatch('getBreadCrumbs', {'urls': currentPath})
    },
    getBreadCrumbs () {
      return this.breadCrumbs
    },
    getReviewPath () {
      let leadingSlash = ''
      if (!this.$route.path.match(/\/$/)) {
        leadingSlash = '/'
      }

      return this.$route.path + leadingSlash + 'reviews/'
    },
    getRatingIconName (value, baseScore) {
      if (value >= baseScore) return 'star_active'
      else return 'star'
    },
    getRatingIconClass (value, baseScore) {
      return 'icon icon-' + this.getRatingIconName(value, baseScore)
    },
    decodeHtml (html) {
      var txt = document.createElement('textarea')
      txt.innerHTML = html
      return txt.value
    },
    stripTags (html) {
      let regex = /(<([^>]+)>)/ig
      return html.replace(regex, '')
    },
    convertDescriptionStr (html) {
      html = '<p>' + html + '</p>'
      html = html.replace(/\n/g, '</p><p>')
      return html.replace(/<p>/g, '<p class="descr single">')
    },
    getImageURL (url) {
      return url + '?w=800&q=80'
    },
    getMetaURL () {
      let trailingSlash = ''
      if (!this.$route.path.match(/\/$/)) {
        trailingSlash = '/'
      }
      return Vue.url.options.root + this.$route.path + trailingSlash
    },
    addItemToWishlist (event) {
      event.preventDefault()
      $('#addToWishlist').attr('disabled', 'disabled')
      $('body').css({cursor: 'wait'})
      this.$store.dispatch('addToWishList', {eventId: $('[name=events_id]').val()}).then(response => {
        $('body').css({cursor: 'default'})
        $('#addToWishlist').html('ADDED TO WISHLIST!').removeClass('purple').addClass('grey')
      }, error => {
        console.log(error)
        $('body').css({cursor: 'default'})
      })
    },
    getSimilarToursClass () {
      if (this.tour.tourGuides.length > 0) {
        return 'tour-list-section'
      } else {
        return 'tour-list-section grey bordered'
      }
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
    }
  }
}
</script>
<style>
  
</style>