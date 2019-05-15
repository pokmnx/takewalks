<template>
  <div class="signup-box">
    <div class="inputs">
      <div class="input-row col md-placeholder">
        <input type="text" id="signup-name" name="signup_name" placeholder='Name' v-validate="{ required: true, regex: /^[A-Za-z -]+$/ }">
        <img class="validate-icon" v-if="errors.has('signup_name')" src="../assets/svg/invalid-input.svg" alt="">
        <img class="validate-icon valid-icon"  v-if="!errors.has('signup_name')" src="../assets/svg/valid-input.svg" alt="">
        <span class="payment-error-msg" v-show=" errors.has('signup_name') && errors.items[0].rule === 'required'">Please enter your first name.</span>
        <span class="payment-error-msg" v-show=" errors.has('signup_name') && errors.items[0].rule === 'regex'">The name field may only contain alphabetic characters.</span>
            
      </div>
      <div class="input-row col md-placeholder">
        <input type="email" id="signup-email" name="signup_email" placeholder='Email' v-validate="'required|email'">
        <img class="validate-icon" v-show="errors.has('signup_email')" src="../assets/svg/invalid-input.svg" alt="">
        <img class="validate-icon valid-icon" v-if="!errors.has('signup_email')" src="../assets/svg/valid-input.svg" alt="">
        <span class="payment-error-msg" v-show="errors.has('signup_email') && errors.items[0].rule === 'required'">Please enter your email address.</span>
        <span class="payment-error-msg" v-show=" errors.has('signup_email') && errors.items[0].rule === 'email'">The email field must be a valid email.</span>
      </div>
    </div>
    <div class="error-message" ></div>
    <div class="center-btn smaller">
      <button class="btn primary purple" id="signup-button" @click="onSignUp">Sign Up</button>
    </div>
  </div>
</template>

<script>

import $ from 'jquery'

export default {
  name: 'SignupBox',
  methods: {
    onSignUp () {
      if (this.errors.any()) {
        return
      }
      $('.signup-box .error-message').hide()
      var signupName = $('#signup-name').val()
      var signupEmail = $('#signup-email').val()

      var data = {
        'listId': '965',
        'name': signupName,
        'email': signupEmail
      }
      $('body').css({cursor: 'wait'})
      this.$store.dispatch('signUpEmail', data).then(() => {
        $('body').css({cursor: 'default'})
        $('.signup-box .error-message').html('Sign up Successful!').stop(1, 1).fadeIn(300)
      }, error => {
        console.log(error)
        $('body').css({cursor: 'default'})
        $('.signup-box .error-message').html('Sign up failed').stop(1, 1).fadeIn(300)
      })
    }
  }
}
</script>
