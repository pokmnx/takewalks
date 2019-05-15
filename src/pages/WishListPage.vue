<template>
  <div>
    <AccountHeader
      :user="user"
      selectedPage="wishlist"
    />
    <section class="grey bordered">
      <div v-if="wishList.tours === undefined || wishList.tours.length === 0" class="account-no-content">
        <p class="descr">You don't have tours in your Wishlist yet!</p>
        <div class="center-btn small">
          <router-link to="/" class="btn secondary green">Find A Tour</router-link>
        </div>
      </div>
      <div v-else class="upcoming-tours">
        <div class="container">
          <div
            class="wishlist-tours"
            v-for="(tour, index) in wishList.tours"
            v-bind:key="index"
          >
            <div class="wishlist-tour" :data-tour-id="tour.event_id">
              <div class="tour-img" :style="getImageStyle(tour.image)">
              </div>
              <div class="tour-details">
                <div class="tour-price"><span class="default-price">$ {{ tour.price }}</span></div>
                <h3 class="tour-title">{{ tour.title }}</h3>
                <p class="descr" v-html="tour.description"></p>
                <div class="tour-footer">
                  <a :data-event-id="tour.event_id" class="remove-underlined"><svgicon name="remove_tour" class="icon icon-remove_tour" /> Remove from wishlist</a>
                  <router-link :to="getTourRef(tour)" class="btn secondary purple">View Tour</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import $ from 'jquery'
import AccountHeader from '@/containers/account/AccountHeader'
import { mapGetters } from 'vuex'

export default {
  name: 'WishListPage',
  components: {
    AccountHeader
  },
  computed: {
    ...mapGetters([
      'user',
      'wishList'
    ])
  },
  mounted () {
    $('#launcher').removeClass('launcher-detail')
    $('body').css({cursor: 'wait'})
    var self = this
    this.$store.dispatch('getWishList').then(() => {
      $('body').css({cursor: 'default'})
      $('[data-event-id]').click(self.remove).css({cursor: 'pointer'})
    }, error => {
      console.log(error)
      $('body').css({cursor: 'default'})
    })
    document.dispatchEvent(new Event('render-event'))
  },
  methods: {
    getImageStyle (url) {
      return 'background-image: url(' + url + ')'
    },
    getTourRef (tour) {
      return '/' + tour.citySlug + '/' + tour.slug
    },
    remove (event) {
      var eventId = event.currentTarget.dataset.eventId
      $('[data-tour-id=' + eventId + ']').remove()
      $('body').css({cursor: 'wait'})
      this.$store.dispatch('removeWishList', {eventId: eventId}).then(() => {
        $('body').css({cursor: 'default'})
      }, () => {
        $('body').css({cursor: 'default'})
      })
    }
  }
}
</script>
