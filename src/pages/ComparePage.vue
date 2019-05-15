<template>
  <div id="compare" :data-slug="$route.params.slug">
    <LazyBackground
      class="page-hero tag-comparison"
      :imageSource="this.compareTag.heroImage"
      :loadingImage="this.compareTag.heroImage + '?w=80'"
    >
    </LazyBackground>

    <div class="tabs centered hide-mobile city-nav-tabs">
      <a href="#overview" data-scroll-toggler="overview" class="tab-item city-tour-tab active">Overview</a>
      <a href="#upcomingTours" data-scroll-toggler="upcomingTours" class="tab-item city-tour-tab">Upcoming Tours</a>
      <a href="#browseTours" data-scroll-toggler="browseTours" class="tab-item city-tour-tab">Browse Tours</a>
      <a href="#highlights" data-scroll-toggler="highlights" class="tab-item city-tour-tab">Highlights</a>
      <a href="#visitingNotes" data-scroll-toggler="visitingNotes" class="tab-item city-tour-tab">Notes for Visiting</a>
      <a href="#faq" data-scroll-toggler="faq" class="tab-item city-tour-tab">FAQ</a>
    </div>

    <section class="city-description-box bordered" id="overview" data-scroll-target="overview">
      <h1 class="section-heading" v-html="compareTag.title" />
      <div class="hide-mobile description-container descr" v-html="convertDescriptionStr(compareTag.description)" />
    </section>

    <UpcomingTours />
    <div class="tour-list-wrap standalone">
      <BrowseTours :tours="compareTag.relatedTours" />
      <HighlightTab
        :contents="compareTag.highlights"
      />
      <NotesForVisiting
        :tagPageNotes="compareTag.tagPageNotes"
      />
      <CompareFaq :faqs="compareTag.faqs" />
      <ComparisonBar />
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Vue from 'vue'
import UpcomingTours from '@/containers/compare_tour/UpcomingTours'
import BrowseTours from '@/containers/compare_tour/BrowseTours'
import NotesForVisiting from '@/containers/compare_tour/NotesForVisiting'
import CompareFaq from '@/containers/compare_tour/CompareFaq'
import ComparisonBar from '@/containers/compare_tour/ComparisonBar'
import HighlightTab from '@/containers/compare_tour/HighlightTab'
import LazyBackground from '@/components/LazyBackground'
import store from '../store'

import { mapGetters } from 'vuex'
export default {
  name: 'ComparePage',
  components: {
    UpcomingTours,
    BrowseTours,
    NotesForVisiting,
    HighlightTab,
    CompareFaq,
    ComparisonBar,
    LazyBackground
  },
  computed: {
    ...mapGetters([
      'compareTag',
      'breadCrumbs'
    ])
  },
  selectedTours: {},
  mounted () {
    $('#launcher').removeClass('launcher-detail')
    this.selectedTours = {}
    $('html, body').animate({scrollTop: 0}, 400)
    this.compareTourPicker(this.$parent, $('.tour-list-items', $('#compare')))
    document.dispatchEvent(new Event('render-event'))
    this.buildBreadcrumbsCompare()
  },
  metaInfo () {
    return {
      title: this.compareTag !== undefined ? this.compareTag.metaTitle : '',
      meta: [
        {
          'property': 'og:title',
          'content': this.compareTag !== undefined ? this.compareTag.metaTitle : ''
        },
        {
          'property': 'og:description',
          'content': this.compareTag !== undefined ? this.compareTag.metaDescription : ''
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
          'content': this.compareTag.videoThumbnail
        },
        {
          'property': 'fb:app_id',
          'content': 1989124628036695
        },
        {
          vmid: 'description',
          name: 'description',
          content: this.compareTag !== undefined ? this.compareTag.metaDescription : ''
        }
      ],
      script: [
        { innerHTML: this.compareTag.microData,
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
  methods: {
    getBackgroundImgStyle () {
      return 'background-image: url(' + this.compareTag.heroImage + ')'
    },
    compareTourPicker (parent, $el) {
      var $compareBar
      var selectedTours = {}
      var self = this
      var _init = function () {
        $compareBar = $('.comparison-bar')
        $el.find('.compare-cb input[type=checkbox]').click(toggleTour)
        $compareBar.on('click', '.icon-close', function () { removeTour($(this).parents('.comparing-tour').attr('data-tour-id')) })
        $compareBar.find('.btn.btn-compare-tours').click(function () { compareTours() })
      }
      var getTourEl = function (id, name) {
        return $('<div>', {'class': 'comparing-tour', 'data-tour-id': id})
          .append(name)
          .append('<svg version="1.1" viewBox="0 0 20 20" class="icon icon-close svg-icon svg-fill" style="width: 28px; height: 28px;"><path pid="0" _fill="#BAC5C9" d="M20 .98L19.02 0 10 9.02.98 0 0 .98 9.02 10 0 19.02l.98.98L10 10.98 19.02 20l.98-.98L10.98 10z"></path></svg>')
      }
      var toggleTour = function () {
        var $tour = $(this).parents('.tour-box')
        var tourId = $tour.data('tour-id')
        if ($(this).prop('checked')) {
          selectedTours[tourId] = $tour.find('.tour-title')[0].dataset.titleShort
          $compareBar.find('.btn-compare-tours').before(getTourEl(tourId, selectedTours[tourId]))
        } else {
          removeTour(tourId)
        }
        if (Object.keys(selectedTours).length >= 3) {
          $el.find('.compare-cb input[type=checkbox]:not(:checked)').prop('disabled', true)
        }
        toggleBar()
      }
      var removeTour = function (tourId) {
        if (typeof selectedTours[tourId] !== 'undefined') {
          delete selectedTours[tourId]
          $compareBar.find('[data-tour-id=' + tourId + ']').remove()
          $el.find('[data-tour-id=' + tourId + '] .compare-cb input[type=checkbox]').prop('checked', false)
        }
        $el.find('.compare-cb input[type=checkbox]:not(:checked)').prop('disabled', false)
        toggleBar()
      }
      var toggleBar = function () {
        console.log('removing - ' + Object.keys(selectedTours))
        $compareBar.toggleClass('active', Object.keys(selectedTours).length > 0)
      }
      var compareTours = function () {
        if (Object.keys(selectedTours).length > 0) {
          var path = '/' + $('#compare')[0].dataset.slug + '/' + Object.keys(selectedTours).join('/')
          self.$router.push(path)
        }
      }
      _init()
    },
    convertDescriptionStr (html) {
      html = '<p>' + html + '</p>'
      html = html.replace(/\n/g, '</p><p>')
      return html.replace(/<p>/g, '<p class="descr single">')
    },
    getMetaURL () {
      let trailingSlash = ''
      if (!this.$route.path.match(/\/$/)) {
        trailingSlash = '/'
      }
      return Vue.url.options.root + this.$route.path + trailingSlash
    },
    buildBreadcrumbsCompare () {
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
    }
  }
}
</script>
