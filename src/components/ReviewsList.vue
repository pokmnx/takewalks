<template>
    <div class="" v-if="Array.isArray(reviews)">
        <div v-for="(review, index) in reviews" v-bind:key="index" class="" >
            <div class="review-box review-box-detail">
                <div class="tour-box-reviews tour-box-reviews-detail">
                    <svgicon
                        v-for="index in 5"
                        v-bind:key="index"
                        :name="getRatingIconName(review.numberOfStars, index)"
                        :class="getRatingIconClass(review.numberOfStars, index)"
                    />
                </div>
                <p class="descr" v-html="review.reviewContent"></p>
                <div class="review-box-footer">
                    <span class="green author">{{ review.customerName.substr(0,review.customerName.indexOf(' ')) }}</span>
                    <span class="typo">{{ new Date(review.date.split(' ').join('T')) | moment('MMM DD, Y') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
import $ from 'jquery'

export default {
  name: 'ReviewsList',
  props: {
    counter: {
      type: Number,
      required: true
    }
  },
  created () {
    this.limit = this.counter
    var self = this
    this.$store.dispatch('getTourReviews', {eventId: this.tour.eventID, offset: this.offset, limit: this.limit}).then((data) => {
      self.reviews = self.reviews.concat(data)
      self.offset = self.counter
      $('.all-reviews-btn').show()
      $('.book-now-loading').hide()
    }, error => console.log(error))
  },
  watch: {
    counter: function (newCounter) {
      var self = this
      this.limit = 3
      this.$store.dispatch('getTourReviews', {eventId: this.tour.eventID, offset: this.offset, limit: this.limit}).then((data) => {
        self.reviews = self.reviews.concat(data)
        self.offset += self.limit
        $('.book-now-loading').hide()
        if (newCounter >= this.tour.reviewsCount) {
          $('.all-reviews-btn').hide()
        } else {
          $('.all-reviews-btn').show()
        }
      }, error => console.log(error))
    }
  },
  computed: {
    ...mapGetters([
      'tour'
    ])
  },
  methods: {
    getSlugRef (slug) {
      return '/' + slug
    },
    getRatingIconName (value, baseScore) {
      if (value >= baseScore) return 'star_active'
      else return 'star'
    },
    getRatingIconClass (value, baseScore) {
      return 'icon icon-' + this.getRatingIconName(value, baseScore)
    }
  },
  data () {
    return {
      reviews: [],
      offset: 0,
      limit: 0
    }
  }
}
</script>
