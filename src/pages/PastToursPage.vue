<template>
  <div>
    <AccountHeader
      :user="user"
      selectedPage="past_tours"
    />
    <section class="grey bordered">
      <div v-if="pastTours.length === 0" class="account-no-content">
        <p class="descr">You don't have any past tours yet!</p>
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
                <th>Guests</th>
                <th>Total Cost</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tour, index) in pastTours" v-bind:key="index">
                <td>
                  {{ new Date(tour.tourDateTime) | moment('MMM Do YY') }}<br>
                  {{ new Date(tour.tourDateTime) | moment('h:mm a') }}
                </td>
                <td>
                  <span v-html="tour.name" />
                  <span>Purchased on: {{ new Date(tour.booking_time) | moment('MMM Do YY') }}</span>
                </td>
                <td>{{ tour.number_adults + tour.number_students + tour.number_children + tour.number_seniors + tour.number_infants }}</td>
                <td>$ {{ tour.price }}</td>
                <td><a href="/past_tours/refund/<?= $pastTour->bookingDetailsId ?>" class="normal underlined">Report Issue</a></td>
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

export default {
  name: 'PastToursPage',
  components: {
    AccountHeader
  },
  mounted () {
    $('#launcher').removeClass('launcher-detail')
    document.dispatchEvent(new Event('render-event'))
  },
  data () {
    return {
      user: {
        fname: 'Robel',
        lname: 'Alemu'
      },
      pastTours: [
        {
          citySlug: 'florence-tours',
          slug: 'tuscany-tours-from-florence',
          discount: 35,
          image: 'https://images.contentful.com/twizyp0t114t/5GCyxVy1QQqkgEAcwacW2M/2ab65a9669cb8496d1bb09ac0d2e05b6/tuscany-from-florence.jpg',
          medal: 'Gold',
          price: 181,
          flag: 'New',
          name: 'Skip the Line Colosseum Tour with Virtual Reality & Gladiator&#39;s Barracks Acces',
          titleShort: 'Skip the Line Colosseum',
          listingText: 'Use virtual reality to explore the Colosseum, Roman Forum & Palatine Hill - plus special access at the Gladiator&#39;s Barracks!',
          reviewsAverage: 4.8,
          reviewsCount: 1251,
          duration: '3 hours',
          groupSize: 15,
          event_id: '1',
          tourDateTime: '2017/8/6 12:30:54',
          booking_time: '2017/8/3 4:54:12',
          number_adults: 1,
          number_students: 2,
          number_seniors: 3,
          number_infants: 4,
          number_children: 5
        },
        {
          citySlug: 'florence-tours',
          slug: 'tuscany-tours-from-florence',
          discount: 11,
          image: 'https://images.contentful.com/twizyp0t114t/5GCyxVy1QQqkgEAcwacW2M/2ab65a9669cb8496d1bb09ac0d2e05b6/tuscany-from-florence.jpg',
          medal: 'Bronze',
          price: 181,
          flag: 'Likely To Sell Out',
          name: 'Skip the Line Colosseum Tour with Virtual Reality & Gladiator&#39;s Barracks Acce',
          listingText: 'Use virtual reality to explore the Colosseum, Roman Forum & Palatine Hill - plus special access at the Gladiator&#39;s Barracks!',
          reviewsAverage: 3.5,
          reviewsCount: 256,
          duration: '3 hours 10 mins',
          groupSize: 15,
          event_id: '2',
          tourDateTime: '2017/8/6 12:30:54',
          booking_time: '2017/8/3 4:54:12',
          number_adults: 1,
          number_students: 2,
          number_seniors: 3,
          number_infants: 4,
          number_children: 5
        },
        {
          citySlug: 'florence-tours',
          slug: 'tuscany-tours-from-florence',
          discount: 0,
          image: 'https://images.contentful.com/twizyp0t114t/5GCyxVy1QQqkgEAcwacW2M/2ab65a9669cb8496d1bb09ac0d2e05b6/tuscany-from-florence.jpg',
          medal: 'Silver',
          price: 181,
          flag: 'Exclusive',
          name: 'Skip the Line Colosseum Tour with Virtual Reality & Gladiator&#39;s Barracks Access',
          listingText: 'Use virtual reality to explore the Colosseum, Roman Forum & Palatine Hill - plus special access at the Gladiator&#39;s Barracks!',
          reviewsAverage: 4,
          reviewsCount: 3,
          duration: '3 hours',
          groupSize: 15,
          event_id: '3',
          tourDateTime: '2017/8/6 12:30:54',
          booking_time: '2017/8/3 4:54:12',
          number_adults: 1,
          number_students: 2,
          number_seniors: 3,
          number_infants: 4,
          number_children: 5
        }
      ]
    }
  }
}
</script>
