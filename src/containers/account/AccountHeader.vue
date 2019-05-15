<template>
  <section class="account-section">
    <div class="container">
      <div class="account-header">
        <img src="../../assets/img/user.svg" alt="">
        <h2 class="heading">{{ user.fname }} {{ user.lname }}</h2>
        <a @click="logout" class="green normal">Sign Out</a>
      </div>
    </div>
    <div class="tabs outlined city-nav-tabs my-account-tabs">
      <router-link to="/account" :class="getTabClass('account')">Upcoming Tours</router-link>
      <router-link to="/past_tours" :class="getTabClass('past_tours')">Past Tours</router-link>
      <router-link to="/wishlist" :class="getTabClass('wishlist')">WishList</router-link>
      <router-link to="/settings" :class="getTabClass('settings')">Settings</router-link>
    </div>
  </section>
</template>

<script>

import $ from 'jquery'

export default {
  name: 'AccountHeader',
  props: {
    user: {
      type: Object,
      required: true
    },
    selectedPage: {
      type: String,
      required: true
    }
  },
  methods: {
    getTabClass (tab) {
      if (tab === this.selectedPage) {
        return 'tab-item city-tour-tab active'
      } else {
        return 'tab-item city-tour-tab'
      }
    },
    logout () {
      var self = this
      $('body').css({cursor: 'wait'})
      this.$store.dispatch('logout').then(() => {
        $('body').css({cursor: 'default'})
        self.$router.push({path: '/'})
      }, reason => {
        $('body').css({cursor: 'default'})
        console.log(reason)
      })
    }
  }
}
</script>
