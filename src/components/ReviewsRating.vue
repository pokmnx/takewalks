<template>
  <div class="review-rating-container review-page-rating-container">
    <div v-if="getCount() > 1" class="review-rating-content">
        <img class="review-rating-icon" src="../assets/svg/review-rating-icon.svg" alt="review-rating-icon"/>
        <h2 class="review-rating-heading">Verified guest reviews</h2>
        <h2 class="review-rating-total">{{getCount() }}</h2>
        <!-- <br> -->
        <div class="tour-box-reviews review-box-reviews">
            <svgicon width="20" height="20" :name="getRatingIconName(getAverage(), 1)" :class="getRatingIconClass(getAverage(), 1)" />
            <svgicon width="20" height="20" :name="getRatingIconName(getAverage(), 2)" :class="getRatingIconClass(getAverage(), 2)" />
            <svgicon width="20" height="20" :name="getRatingIconName(getAverage(), 3)" :class="getRatingIconClass(getAverage(), 3)" />
            <svgicon width="20" height="20" :name="getRatingIconName(getAverage(), 4)" :class="getRatingIconClass(getAverage(), 4)" />
            <svgicon width="20" height="20" :name="getRatingIconName(getAverage(), 4.7)" :class="getRatingIconClass(getAverage(), 4.7)" /> 
        </div>
        <br>
        <!-- <a href="#" class="see-all-reviews" >See all reviews</a> -->
        <!-- <br>
        <br> -->
        <span class="rates-content"><u>5 star reviews</u>   <svg width="160px" height="12px" viewBox="0 0 160 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <!-- Generator: Sketch 49.3 (51167) - http://www.bohemiancoding.com/sketch --><desc>Created with Sketch.</desc><defs><rect id="path-1" x="0" y="0" width="160" height="12" ></rect></defs><g id="Desktop-UI-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Desktop-1920x1080-(Tour-Page-Option-2-)1" transform="translate(-674.000000, -3502.000000)"><g id="Tour-Info-1" transform="translate(295.000000, 188.000000)"><g id="Verified-guest-reviews-1" transform="translate(26.000000, 3014.000000)"><g id="Reviews-stars-1" transform="translate(263.000000, 288.000000)"><g id="Bars-1"><g id="Bar-2" transform="translate(90.000000, 12.000000)"><g id="Rectangle-1"><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use><rect stroke="#FEC000" stroke-width="1" x="0.5" y="0.5" width="159" height="11" ></rect></g><rect id="Rectangle-2" fill="#FEC000" x="0" y="0" :width="(fiveStars() * 100) / getCount() + '%'" height="12" ></rect><rect id="Rectangle-2-Copy" fill="#FEC000" x="113.684211" y="0" width="3.36842105" height="12"></rect></g></g></g></g></g></g></g></svg>   {{ fiveStars() }}</span>
        <br>
        <span class="rates-content"><u>4 star reviews</u>   <svg width="160px" height="12px" viewBox="0 0 160 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <!-- Generator: Sketch 49.3 (51167) - http://www.bohemiancoding.com/sketch --><desc>Created with Sketch.</desc><defs><rect id="path-2" x="0" y="0" width="160" height="12" ></rect></defs><g id="Desktop-UI-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Desktop-1920x1080-(Tour-Page-Option-2-)2" transform="translate(-674.000000, -3502.000000)"><g id="Tour-Info-2" transform="translate(295.000000, 188.000000)"><g id="Verified-guest-reviews-2" transform="translate(26.000000, 3014.000000)"><g id="Reviews-stars-2" transform="translate(263.000000, 288.000000)"><g id="Bars-2"><g id="Bar-3" transform="translate(90.000000, 12.000000)"><g id="Rectangle-2"><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use><rect stroke="#FEC000" stroke-width="1" x="0.5" y="0.5" width="159" height="11" ></rect></g><rect id="Rectangle-3" fill="#FEC000" x="0" y="0" :width="(fourStars() * 100) / getCount()+ '%'" height="12" ></rect><rect id="Rectangle-3-Copy" fill="#FEC000" x="113.684211" y="0" width="3.36842105" height="12"></rect></g></g></g></g></g></g></g></svg>   {{ fourStars() }}</span>
        <br>
        <span class="rates-content"><u>3 star reviews</u>   <svg width="160px" height="12px" viewBox="0 0 160 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <!-- Generator: Sketch 49.3 (51167) - http://www.bohemiancoding.com/sketch --><desc>Created with Sketch.</desc><defs><rect id="path-2" x="0" y="0" width="160" height="12" ></rect></defs><g id="Desktop-UI-3" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Desktop-1920x1080-(Tour-Page-Option-2-)3" transform="translate(-674.000000, -3502.000000)"><g id="Tour-Info-3" transform="translate(295.000000, 188.000000)"><g id="Verified-guest-reviews-3" transform="translate(26.000000, 3014.000000)"><g id="Reviews-stars-3" transform="translate(263.000000, 288.000000)"><g id="Bars-2"><g id="Bar-3" transform="translate(90.000000, 12.000000)"><g id="Rectangle-2"><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use><rect stroke="#FEC000" stroke-width="1" x="0.5" y="0.5" width="159" height="11" ></rect></g><rect id="Rectangle-4" fill="#FEC000" x="0" y="0" :width="(threeStars() * 100) / getCount()+ '%'" height="12" ></rect><rect id="Rectangle-4-Copy" fill="#FEC000" x="113.684211" y="0" width="3.36842105" height="12"></rect></g></g></g></g></g></g></g></svg>   {{ threeStars() }}</span>
        <br>
        <span class="rates-content"><u>2 star reviews</u>   <svg width="160px" height="12px" viewBox="0 0 160 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <!-- Generator: Sketch 49.3 (51167) - http://www.bohemiancoding.com/sketch --><desc>Created with Sketch.</desc><defs><rect id="path-2" x="0" y="0" width="160" height="12" ></rect></defs><g id="Desktop-UI-4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Desktop-1920x1080-(Tour-Page-Option-2-)4" transform="translate(-674.000000, -3502.000000)"><g id="Tour-Info-4" transform="translate(295.000000, 188.000000)"><g id="Verified-guest-reviews-4" transform="translate(26.000000, 3014.000000)"><g id="Reviews-stars-4" transform="translate(263.000000, 288.000000)"><g id="Bars-2"><g id="Bar-3" transform="translate(90.000000, 12.000000)"><g id="Rectangle-2"><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use><rect stroke="#FEC000" stroke-width="1" x="0.5" y="0.5" width="159" height="11" ></rect></g><rect id="Rectangle-5" fill="#FEC000" x="0" y="0" :width="(twoStars() * 100) / getCount() + '%'" height="12" ></rect><rect id="Rectangle-5-Copy" fill="#FEC000" x="113.684211" y="0" width="3.36842105" height="12"></rect></g></g></g></g></g></g></g></svg>   {{ twoStars() }}</span>
        <br>
        <span class="rates-content"><u>1 star reviews</u>   <svg width="160px" height="12px" viewBox="0 0 160 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> Generator: Sketch 49.3 (51167) - http://www.bohemiancoding.com/sketch<desc>Created with Sketch.</desc><defs><rect id="path-2" x="0" y="0" width="160" height="12" ></rect></defs><g id="Desktop-UI-5" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Desktop-1920x1080-(Tour-Page-Option-2-)5" transform="translate(-674.000000, -3502.000000)"><g id="Tour-Info-5" transform="translate(295.000000, 188.000000)"><g id="Verified-guest-reviews-5" transform="translate(26.000000, 3014.000000)"><g id="Reviews-stars-5" transform="translate(263.000000, 288.000000)"><g id="Bars-2"><g id="Bar-3" transform="translate(90.000000, 12.000000)"><g id="Rectangle-2"><use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use><rect stroke="#FEC000" stroke-width="1" x="0.5" y="0.5" width="159" height="11" ></rect></g><rect id="Rectangle-6" fill="#FEC000" x="0" y="0" :width="(oneStar() * 100) / getCount() + '%'" height="12" ></rect><rect id="Rectangle-6-Copy" fill="#FEC000" x="113.684211" y="0" width="3.36842105" height="12"></rect></g></g></g></g></g></g></g></svg>   {{ oneStar() }}</span>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'ReviewsRating',
  computed: {
    ...mapGetters([
      'tour',
      'tempCart',
      'isLogged'
    ]),
    reviewStatus () {
      return this.$store.state.TourList.reviewStatus
    }
  },
  // created () {
  //   this.$store.dispatch('getTourReviewStatus', {eventId: this.tour.eventID})
  // },
  mounted () {
  },
  methods: {
    fiveStars () {
      return this.tour.review_status.data.feedback_count_five_stars
    },
    fourStars () {
      return this.tour.review_status.data.feedback_count_four_stars
    },
    threeStars () {
      return this.tour.review_status.data.feedback_count_three_stars
    },
    twoStars () {
      return this.tour.review_status.data.feedback_count_two_stars
    },
    oneStar () {
      return this.tour.review_status.data.feedback_count_one_star
    },
    getCount () {
      return this.tour.review_status.data.feedback_count
    },
    getAverage () {
      return this.tour.review_status.data.feedback_average
    },
    getRatingIconName (value, baseScore) {
      if (value >= baseScore) return 'star_active'
      else return 'star'
    },
    getRatingIconClass (value, baseScore) {
      return 'icon icon-' + this.getRatingIconName(value, baseScore)
    }
  }
}
</script>
