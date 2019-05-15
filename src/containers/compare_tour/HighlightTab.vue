<template>
  <section class="grey bordered highlight-tabs" data-scroll-target="highlights" id="highlights">
    <div class="left">
      <div class="title-highlights">
        <div class="icon-holder">
          <svgicon name="highlights" class="icon icon-highlights" width="38" height="38" />
        </div>
        <h2 class="heading default small">Highlights</h2>
      </div>
      <ul class="vertical-tabs">
        <li
          class="vertical-tab"
          v-for="(highlight, index) in this.contents"
          v-bind:key="index"
        >
          <div class="tab-circle">
            {{ index + 1 }}
          </div>
          {{ decodeHtml(highlight.title) }}
        </li>
      </ul>
    </div>
    <div
      class="right"
      style="display:none"
      v-for="(highlight, index) in this.contents"
      v-bind:key="index"
    >
      <div class="description-highlight">
        <div class="img-highlight float-left">
          <LazyBackground
            class="img"
            :imageSource="getImageStyle(highlight, false)"
            :loadingImage="getImageStyle(highlight, true)"
          >
          </LazyBackground>
        </div>
        <h2 class="header blue separator">
          <span v-html="convertDescriptionStr(highlight.pullQuote)" />
        </h2>
        <span v-html="convertDescriptionStr(highlight.description)" />
      </div>
    </div>
  </section>
</template>

<script>

import $ from 'jquery'
import LazyBackground from '@/components/LazyBackground'

export default {
  name: 'HighlightTab',
  components: {
    LazyBackground
  },
  props: {
    contents: {
      type: Array,
      required: true
    }
  },
  mounted () {
    $('.highlight-tabs .vertical-tab').click(function () {
      $('.highlight-tabs').find('.active').removeClass('active')
      $(this).addClass('active')

      $('.highlight-tabs .right').hide().eq($(this).index()).show()
    })
    $('.highlight-tabs .vertical-tab:eq(0)').trigger('click')
  },
  methods: {
    getImageStyle (highlight, bLoading) {
      if (bLoading) {
        return highlight.image + '?w=80'
      } else {
        return highlight.image
      }
    },
    decodeHtml (html) {
      var txt = document.createElement('textarea')
      txt.innerHTML = html
      return txt.value
    },
    convertDescriptionStr (html) {
      html = '<p>' + html + '</p>'
      html = html.replace(/\n/g, '</p><p>')
      var index = 0
      while (html.indexOf('*') !== -1) {
        if (index % 2 === 0) {
          html = html.replace('*', '<em>')
        } else {
          html = html.replace('*', '</em>')
        }
        index += 1
      }
      return html.replace(/<p>/g, '<p class="descr single">')
    }
  }
}
</script>

<style scoped>
  .title-highlights{
    display: flex;
    padding-left: 7%;
  }
  .title-highlights .icon-holder{
    padding-top: 10px;
  }
  .float-left {
    float:  left;
    width: 520px;
  }
  .img-highlight {
    text-align: center;
    text-transform: uppercase;
    padding: .2em;
    margin-right: 30px;
  }

  .img-highlight > .img {
    width: 100%;
    max-width: 520px;
    height: 260px;
    background-size: cover;
    background-position: 50%;
    background-repeat: no-repeat;
  }
  .description-highlight p {
    font-size: 19.2px;
    line-height: 1.3;
    color: #443d47;
  }

  @media screen and (max-width: 1440px) {
    .float-left {
      float: inherit;
      width: 100%;
    }
  }
</style>
