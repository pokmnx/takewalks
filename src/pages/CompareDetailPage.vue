<template>
  <div class="tour-detail-content">
    <ul class="breadcrumbs">
      <li class="active"><router-link :to="getSlugRef(citySlug, slug)"><img src="../assets/svg/breadcrumbs-arrow.svg" /><span>All {{ decodeHtml(tagName) }}</span></router-link></li>
    </ul>
    <div class="tour-detail-top">
      <div class="left-content">
        <div class="tour-heading">
          <h2 class="tour-title"><router-link :to="getSlugRef(citySlug, slug)"><svgicon name="arrow_left" width="24" height="24" class="icon icon-arrow_left"></svgicon></router-link>Compare Tours</h2>
        </div>
      </div>
    </div>
    <router-link :to="getSlugRef(citySlug, slug)"><svgicon name="close" class="icon icon-close compare-tours-go-back" width="28" height="28" data-modal-close></svgicon></router-link>
    <CompareTourHeader
      :tours="tours"
    />
    <CompareTourBody
      :tours="tours"
    />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import $ from 'jquery'
import CompareTourHeader from '@/containers/compare_detail/CompareTourHeader'
import CompareTourBody from '@/containers/compare_detail/CompareTourBody'
// import store from '../store'

export default {
  name: 'CompareDetailPage',
  components: {
    CompareTourHeader,
    CompareTourBody
  },
  computed: {
    ...mapGetters([
      'compareTag'
    ])
  },
  methods: {
    decodeHtml (html) {
      var txt = document.createElement('textarea')
      txt.innerHTML = html
      return txt.value
    },
    getCitySlugRef (slug) {
      return '/' + slug
    },
    getSlugRef (citySlug, slug) {
      return '/' + citySlug + '/' + slug + '/'
    },
    getCityName (slug) {
      let array = slug.split('-')
      let cityName = ''
      for (let index in array) {
        if (array[index] !== 'tours') {
          cityName += array[index].substr(0, 1).toUpperCase() + array[index].substr(1) + ' '
        }
      }
      return cityName
    },
    getTagName () {
      var slug = this.$route.params.slug
      var tag = ''
      let array = slug.split('-')
      for (let index in array) {
        tag += array[index].substr(0, 1).toUpperCase() + array[index].substr(1) + ' '
      }
      return tag
    }
  },
  mounted () {
    $('#launcher').removeClass('launcher-detail')
    $('html, body').animate({scrollTop: 0}, 400)
    document.dispatchEvent(new Event('render-event'))
  },
  data () {
    var tourIDStr = this.$route.params[0]
    var tourIds = tourIDStr.split('/')
    var tours = []
    var stTours = this.$store.getters.compareTag.relatedTours
    for (var i = 0; i < stTours.length; i++) {
      var tour = stTours[i]
      for (var j = 0; j < tourIds.length; j++) {
        if (tour.event_id === parseInt(tourIds[j], 10)) {
          tours.push(tour)
          break
        }
      }
    }
    return {
      slug: this.$route.params.slug + '-compare',
      citySlug: stTours[0].citySlug,
      cityName: this.getCityName(stTours[0].citySlug),
      tagName: this.getTagName(),
      tours: tours
    }
  }
}
</script>
