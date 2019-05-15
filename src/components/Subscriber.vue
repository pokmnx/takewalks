<template>
  <div class="footer-subscribe">
    <h5 class="subtitle white label">SUBSCRIBE TO OUR NEWSLETTER</h5>
    <div>
      <input type="email" id="footer-signup-email" name="footer_signup_email" placeholder="Email Address" v-validate="'required|email'">
      <button class="btn green secondary input-aligned" id="footer-signup-button" @click="onSubscribe">SUBSCRIBE</button>
    </div>
    <img class="validate-icon validate-icon-footer" v-if="errors.has('footer_signup_email')" src="../assets/svg/invalid-input.svg" alt="">
    <img class="validate-icon valid-icon" v-if="!errors.has('footer_signup_email')" src="../assets/svg/valid-input.svg" alt="">
    <span class="payment-error-msg" v-show="errors.has('footer_signup_email') && errors.items[0].rule === 'required'">Please enter your email address.</span>
    <span class="payment-error-msg" v-show=" errors.has('footer_signup_email') && errors.items[0].rule === 'email'">The email field must be a valid email.</span>
  </div>
</template>

<script>

import $ from 'jquery'

export default {
  name: 'Subscriber',
  methods: {
    onSubscribe () {
      if (this.errors.any()) {
        return
      }
      var signup = $('.footer-subscribe')
      var signupButton = signup.find('#footer-signup-button')
      $('.signup-box .error-message').hide()
      var signupEmail = $('#footer-signup-email').val()
      var data = {
        'listId': '965',
        'email': signupEmail
      }
      this.$store.dispatch('signUpEmail', data).then(() => {
        signupButton.html('Thanks!')
      }, error => {
        signupButton.html('Failed!')
        console.log(error)
      })
    }
  }
}
</script>

