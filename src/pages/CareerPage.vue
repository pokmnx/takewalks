<template>
  <main class="default">
    <PageTitle title="Careers at Walks" />
    <section class="grey">
      <div class="container">
        <div>
          <p class="descr">
            <b>Are you interested in joining our passionate, travel-loving, innovative team?  &nbsp;&nbsp;Take a look at our open positions below.</b>
          </p>
          <br/>
          <p class="descr">
            <div class="indeedjobs-widget" data-id="d0ccef0831d76fdd7151" data-theme="light" data-height="320"></div>
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'
import PageTitle from '@/components/PageTitle'

export default {
  name: 'CareerPage',
  components: {
    PageTitle
  },
  created () {
    // The indeed.com widget loads a non-idempotent version of babel-polyfill
    // Babel-polyfill was getting loaded during prerender and again upon each visit to the career page causing a js error
    // To fix we won't let prerender load the indeed widget
    // Then each time the career page is visited we will set babel-polyfill to false before loading the widget
    if (global._babelPolyfill) {
      global._babelPolyfill = false
    }
    if (!window.hasOwnProperty('__PRERENDER_INJECTED')) {
      let js = document.createElement('script')
      js.id = 'indeedjobs-js'
      js.src = 'https://www.indeedjobs.com/widget.js'
      document.head.appendChild(js)
    }
  },
  mounted () {
    $('#launcher').removeClass('launcher-detail')
    $('html, body').animate({scrollTop: 0}, 400)
    document.dispatchEvent(new Event('render-event'))
  },
  metaInfo () {
    return {
      title: 'Careers at Walks',
      meta: [
        {
          'property': 'og:title',
          'content': 'Careers at Walks'
        },
        {
          'property': 'og:description',
          'content': 'Careers at Walks'
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
          content: 'Careers at Walks'
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

