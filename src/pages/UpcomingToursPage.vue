<template>
  <div>
    <AccountHeader
      :user="user"
      selectedPage="account"
    />
    <section class="grey bordered">
      <div v-if="upcomingTours.length === 0" class="account-no-content">
        <p class="descr">You don't have any upcoming tours yet!</p>
        <div class="center-btn small">
          <router-link to="/" class="btn secondary green">Find A Tour</router-link>
        </div>
      </div>
      <div v-else class="upcoming-tours">
        <div class="container">
          <table class="upcoming-tours compact">
            <thead>
              <tr>
                <th>Date/Time</th>
                <th>Tour Name</th>
                <th class="hide-mobile">Guests</th>
                <th class="hide-mobile">Total Cost</th>
                <th class="hide-mobile"></th>
                <th class="hide-mobile"></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tour, index) in upcomingTours" v-bind:key="index">
                <td>
                  {{ new Date(tour.tourDateTime) | moment('MMM Do YY') }}<br>
                  {{ new Date(tour.tourDateTime) | moment('h:mm a') }}
                </td>
                <td>
                  <span v-html="tour.name" />
                  <span>Purchased on: {{ new Date(tour.booking_time) | moment('MMM Do YY') }}</span>
                </td>
                <td class="hide-mobile">{{ tour.guests }}</td>
                <td class="hide-mobile">$ {{ tour.price }}</td>
                <td class="hide-mobile"><a href="/resend-voucher/<?=$upcomingTour['bookingDetailsId']?>" class="normal underlined" >Resend Voucher</a></td>
                <td><a href="/upcoming<?= DS.$upcomingTour['citySlug'].DS.$upcomingTour['slug'].DS.$upcomingTour['bookingDetailsId']; ?>" class="btn secondary grey green-hover">See Details</a></td>
              </tr>
            </tbody>
          </table>
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
  name: 'UpcomingToursPage',
  components: {
    AccountHeader
  },
  computed: {
    ...mapGetters([
      'user',
      'upcomingTours'
    ])
  },
  created () {
    this.$store.dispatch('getUpcomingTours')
  },
  mounted () {
    $('#launcher').removeClass('launcher-detail')
    document.dispatchEvent(new Event('render-event'))
  }
}
</script>
