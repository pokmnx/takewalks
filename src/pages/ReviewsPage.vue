<template>
  <div class="container container-reviews-page">
    <ul class="breadcrumbs" style="margin">
      <li class="active"><router-link :to="'/' +tour.citySlug + '/' + tour.tourSlug + '/'"><img src="../assets/svg/breadcrumbs-arrow.svg" /><span>{{tour.shortTitle}}</span></router-link></li>
    </ul>
    <div class="container container-reviews">
      <h1 class="page-title">Reviews: {{tour.title}}</h1>
      <ReviewsRating />
      <div class="section-title center lastest-reviews-wrapper">
        <ReviewsList :counter="counter"/>
      </div>
      <div class="center-btn none" style="margin:50px; height:200px; margin:0 auto;">
        <button class="btn primary purple all-reviews-btn" v-on:click="increment" style="margin-top:70px; width:336px;height:60px;">SHOW MORE REVIEWS</button>
        <button class="btn primary book-now-loading" style="margin-top:70px;" disabled>Loading, Please Wait...</button>
      </div>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import { mapGetters } from 'vuex'
import ReviewsRating from '@/components/ReviewsRating'
import ReviewsList from '@/components/ReviewsList'

export default {
  name: 'ReviewsPage',
  data () {
    return {
      counter: 5
    }
  },
  components: {
    ReviewsRating,
    ReviewsList
  },
  computed: {
    ...mapGetters([
      'tour',
      'reviews'
    ])
  },
  metaInfo () {
    return {
      title: 'Reviews: ' + this.tour.title,
      meta: [
        {
          'property': 'og:title',
          'content': 'Reviews: ' + this.tour.title
        },
        {
          'property': 'og:description',
          'content': 'Reviews: ' + this.tour.title
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
          content: 'Reviews: ' + this.tour.title
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
    console.log(this.tour)
    $('html, body').animate({scrollTop: 0}, 400)
    document.dispatchEvent(new Event('render-event'))
  },
  methods: {
    increment () {
      $('.all-reviews-btn').hide()
      $('.book-now-loading').show()
      this.counter += 3
    },
    getSlugRef (slug) {
      return '/' + slug
    },
    getRatingIconName (value, baseScore) {
      if (value >= baseScore) return 'star_active'
      else return 'star'
    },
    getRatingIconClass (value, baseScore) {
      return 'icon icon-' + this.getRatingIconName(value, baseScore)
    },
    getMetaURL () {
      let trailingSlash = ''
      if (!this.$route.path.match(/\/$/)) {
        trailingSlash = '/'
      }
      return Vue.url.options.root + this.$route.path + trailingSlash
    }
  }
}
</script>
