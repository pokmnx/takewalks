<template>
  <div class="date-picker-container right-sidebar-item" data-section="datePicker">
    <div class="sidebar-subheading sidebar-subheading-booking">
      <div class="sidebar-circle">1</div>
      <p calss="select-date">Select a date</p>
    </div>
    <slot></slot>
    <div class="sidebar-content sidebar-content-calendar">
      <div class="datepick"></div>
    </div>
    <div class="sidebar-selected-value">
      <div class="input-icon">
        <input type="text" class="blue-hl selected-date" readonly>
        <div class="icon icon-calendar">
          <svgicon name="calendar" width="20" height="20" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'DateForm',
  computed: {
    ...mapGetters([
      'tour'
    ])
  },
  methods: {
    getToursRef () {
      let trailingSlash = ''
      if (!this.tour.tagPageUrl.match(/\/$/)) {
        trailingSlash = '/'
      }
      return '/' + this.tour.citySlug + '/' + this.tour.tagPageUrl + trailingSlash
    }
  }
}
</script>

