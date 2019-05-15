<template>
  <div class="faq-question">
    <div class="faq-question-title">
        <div class="container">
          {{ decodeHtml(question) }}
          <img class="icon icon-collapse" src="../assets/svg/collapse2.svg" />
        </div>
    </div>
    <div class="faq-question-content">
        <div class="container">
          {{ decodeHtml(answer) }}
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FaqItem',
  props: {
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  },
  methods: {
    decodeHtml (html) {
      var txt = document.createElement('textarea')
      txt.innerHTML = html
      return txt.value
    }
  }
}
</script>