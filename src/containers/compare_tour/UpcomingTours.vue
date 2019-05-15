<template>
  <section class="grey bordered upcoming-tours" id="upcomingTours" data-scroll-target="upcomingTours">
    <div class="container">
      <div class="section-title title-inline title-with-datepick">
        <svgicon name="upcoming-tours" class="icon icon-upcoming-tours" width="50" height="50" />
        <h2 class="heading section-heading default">Upcoming Tours</h2>
        <div class="datepick-with-arrows">
          <span class="change-date prev-date">
            <em>Prev</em>
            <svgicon name="arrow_left" class="icon icon-arrow_left left-arrow" width="12" height="12" />
          </span>

          <div class="input-icon">
            <DatePicker
              classes="blue-hl has-datepick"
              placeholder="Select a date"
            />
            <svgicon name="calendar" class="icon icon-calendar" />
          </div>

          <span class="change-date next-date">
            <em>Next</em>
            <svgicon name="arrow_left" class="icon icon-arrow_left left-arrow" width="12" height="12" />
          </span>
        </div>
      </div>

      <div class="upcoming-tours-headings" style="display: none">
        <p>Price</p>
        <p class="tour-name">Tour</p>
        <p>Depart</p>
        <p>Duration</p>
      </div>

      <div class="upcoming-tours-items">
        <UpcomingTourItem
          v-for="(tour, index) in upcoming_tours"
          v-bind:key="index"
          :tour="tour"
        />
      </div>
      <p class="upcoming-tour-not-found compare-row-item center" style="display: none">
        There are no available tours for this date.
      </p>
      <div class="upcoming-tour-loading"  style="display: none">
        <img src="../../assets/svg/loading.svg">
      </div>
    </div>
  </section>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import SubjectTitle from '@/components/SubjectTitle'
import DatePicker from '@/components/DatePicker'
import UpcomingTourItem from '@/containers/compare_tour/UpcomingTourItem'
import { mapGetters } from 'vuex'

const moment = require('moment')
require('moment/locale/es')

Vue.use(require('vue-moment'), {
  moment
})

export default {
  name: 'UpcomingTours',
  components: {
    SubjectTitle,
    DatePicker,
    UpcomingTourItem
  },
  computed: {
    ...mapGetters([
      'upcoming_tours'
    ])
  },
  datePickerInput: null,
  upcomingTours: null,
  header: null,
  noTours: null,
  loading: null,
  request: null,
  upcoming_tours: [],
  mounted () {
    this.datePickerInput = $('#upcomingTours').find('input.has-datepick')
    this.upcomingTours = $('#upcomingTours').find('.upcoming-tours-items')
    this.header = $('#upcomingTours').find('.upcoming-tours-headings')
    this.noTours = $('#upcomingTours').find('.upcoming-tour-not-found')
    this.loading = $('#upcomingTours').find('.upcoming-tour-loading')
    this.datePickerInput.datepick('option', 'onSelect', this.getDateTours)
    $('#upcomingTours').find('.change-date').click(this.changeDate)
    var date = new Date()
    date = date.setDate(date.getDate() + 1)
    this.datePickerInput.val(Vue.moment(date).format('MM/DD/YYYY'))
    this.getDateTours()
  },
  methods: {
    changeDate (event) {
      var date = this.datePickerInput.val() === '' ? '0' : this.datePickerInput.val()
      if (date === '0') {
        return false
      }

      var direction = event.currentTarget.classList.contains('next-date') ? 1 : -1
      this.datePickerInput.val(Vue.moment(date).add(direction, 'days').format('MM/DD/YYYY'))
      this.getDateTours()
    },
    getDateTours () {
      console.log(this.$route.params)
      var date = this.datePickerInput.val() === '' ? '0' : this.datePickerInput.val()
      this.header.hide()
      this.noTours.hide()
      this.loading.show()
      this.upcomingTours.hide()

      if (this.request) {
        this.request.abort()
      }
      var url = process.env.INVENTORY_API + 'upcoming/' + this.$route.params.slug + '-compare/' + encodeURIComponent(date.replace(/\//g, '-'))
      var self = this

      $.ajaxSetup({
        headers: {
          'Authorization': 'Bearer ' + process.env.API_ACCESS_TOKEN
        }
      })

      this.request = $.getJSON(url, function (tours) {
        self.loading.hide()
        if (tours.length) {
          self.header.show()
          self.datePickerInput.val(tours[0].date)
        } else {
          self.noTours.show()
        }
        var sortedTours = []
        tours.forEach(function (tour) {
          sortedTours.push(tour)
        })
        self.upcomingTours.show()
        self.$store.commit('setUpcomingTours', sortedTours)
      })
    }
  }
}
</script>
