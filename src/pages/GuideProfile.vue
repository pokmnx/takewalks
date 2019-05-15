<template>
  <main class="default">
    <div class="container">
      <h1 class="page-title">Meet Our Local Tour Guides</h1>
    </div>

    <section class="grey">
      <div class="container">
        <div class="guide-detail">
          <LazyBackground
            class="col img-col"
            :imageSource="this.guideProfile.tourGuideImage"
            :loadingImage="this.guideProfile.tourGuideImage + '?w=80'"
          >
          </LazyBackground>
          <div class="col">
            <div class="text">
              <h2>{{ guideProfile.fullName }}</h2>
              <h5 class="subtitle green">{{ guideProfile.city }}, {{ guideProfile.country }}</h5>
              <p class="descr">{{ guideProfile.description }}</p>
              <div class="tags">
                <div class="col"
                  v-if="guideProfile.tours"
                  v-for="(tour, index) in guideProfile.tours"
                  v-bind:key="index"
                >
                  <router-link :to="{path: getTourURL(tour)}" class="guide-tag">
                    {{ tour.titleShort }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h2 class="handwriting guide-quote">"{{ guideProfile.quote }}"</h2>
        <h2>About {{ guideProfile.fullName }}</h2>
        <div class="guide-description" style="font-size: 20px" v-html="convertDescriptionStr(guideProfile.descriptionLong)">
        </div>
      </div>
    </section>
  </main>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import { mapGetters } from 'vuex'
import LazyBackground from '@/components/LazyBackground'

export default {
  name: 'GuideProfile',
  components: {
    LazyBackground
  },
  computed: {
    ...mapGetters([
      'guideProfile'
    ])
  },
  mounted () {
    $('#launcher').removeClass('launcher-detail')
    $('html, body').animate({scrollTop: 0}, 400)
    document.dispatchEvent(new Event('render-event'))
  },
  methods: {
    convertDescriptionStr (html) {
      html = '<p>' + html + '</p>'
      html = html.replace(/\n\n__/g, '</p><p><strong>')
      html = html.replace(/__/g, '</strong>')
      html = html.replace('</strong>', '<strong>')
      return html
    },
    getTourURL (tour) {
      return '/' + tour.citySlug + '/' + tour.slug + '/'
    },
    getMetaURL () {
      let trailingSlash = ''
      if (!this.$route.path.match(/\/$/)) {
        trailingSlash = '/'
      }
      return Vue.url.options.root + this.$route.path + trailingSlash
    }
  },
  metaInfo () {
    return {
      link: [
        { 'rel': 'canonical',
          'href': this.getMetaURL()
        }
      ]
    }
  }
}
</script>

