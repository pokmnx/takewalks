<template>
  <div>
    <div class="section-sep-heading" id="faq" data-scroll-target="faq">
      <div class="container">
        <svgicon name="faq-new" class="icon icon-faq-new" width="38" height="38" />
        <h2 class="heading">FAQ</h2>
      </div>
    </div>
    <section class="last-section" id="faq">
      <div class="faq-section section bordered">
        <FaqItem
          v-for="faq in this.faqs"
          v-bind:key="faq.question"
          :question="faq.question"
          :answer="faq.answer"
        />
      </div>
    </section>
  </div>
</template>

<script>

import $ from 'jquery'
import FaqItem from '@/components/FaqItem'

export default {
  name: 'CompareFaq',
  props: {
    faqs: {
      type: Array,
      required: true
    }
  },
  components: {
    FaqItem
  },
  mounted () {
    $('.faq-question-title').click(function () {
      var $tar = $(this)
        .parent()
        .find('.faq-question-content')
      $tar.toggleClass('active')
      $(this)
        .parent()
        .toggleClass('active')
    })
  }
}
</script>