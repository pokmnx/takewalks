<template>
  <section class="city-description-box notes" id="visitingNotes" data-scroll-target="visitingNotes" style="padding-left: 0">
    <div class="section-sep-heading" style="background-color: #ffffff; border: 1px solid #ffffff;" >
      <div class="container">
        <svgicon name="notes-for-visiting" class="icon icon-notes-for-visiting" width="38" height="38" />
        <h2 class="heading">Notes for Visiting</h2>
      </div>
    </div>
    <div class="container" style="text-align: justify">
      <p v-if="this.tagPageNotes != ''" class="descr" v-html="convertDescriptionStr(this.tagPageNotes)" />
    </div>
  </section>
</template>

<script>
export default {
  name: 'NotesForVisiting',
  props: {
    tagPageNotes: String
  },
  methods: {
    convertDescriptionStr (html) {
      html = '<p>' + html + '</p>'
      html = html.replace(/__\n/g, '</strong> ')
      html = html.replace(/\n\n__/g, '</p><p><strong>')
      return html.replace(/__/g, '<strong>')
    }
  }
}
</script>
