<template>
  <div class="right-sidebar-item book-now-container active">
    <div class="sidebar-content cta">
      <div class="error-message booking-error-message" >
        <span class="span-booking-error-message"> Sorry, there are only 3 tickets left for this tour time</span>
      </div>
      <br>
      <!-- <router-link :to="{path: '/payment/'}"> -->
        <button class="btn primary btn-book-now" disabled @click="loading">Book Now</button>
        <button class="btn primary book-now-loading" disabled>Loading, Please Wait...</button>
      <!-- </router-link> -->
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import store from '../../store/index'
import { mapGetters } from 'vuex'

export default {
  name: 'BookSubmitForm',
  computed: {
    ...mapGetters([
      'tour'
    ])
  },
  methods: {
    loading () {
      var checkedOptions = []
      if (this.tour.hasOr || this.tour.hasXor) {
        if (this.tour.hasXor) {
          checkedOptions.push(store.getters.tempCart.productLocatorOptions[0].value)
        }
        if (this.tour.hasOr) {
          store.getters.tempCart.productLocatorOptions = []
          $.each($("[class='optionsCheckbox']:checked"), function () {
            checkedOptions.push($(this).val())
            console.log(checkedOptions)
            store.getters.tempCart.productLocatorOptionsData.push({value: $(this).val(), name: $(this).attr('data-name'), stageId: $(this).attr('data-stageId'), required: false})
            console.log(checkedOptions)
          })
        }
        store.getters.tempCart.productLocatorOptions = checkedOptions
      }
      store.dispatch('addCart', store.getters.tempCart).then((response) => {
        this.$router.push({path: '/payment'})
      }, error => {
        store.getters.tempCart.productLocatorOptions = store.getters.tempCart.productLocatorOptions[0]
        console.log(error)
      })
      $('.btn-book-now').hide()
      $('.book-now-loading').show()
    }
  }
}
</script>

