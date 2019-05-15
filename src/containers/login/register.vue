<template>
  <div class="sidebar login-sidebar login-sidebar-register hidden">
    <div class="sidebar-heading">
      <h2 class="heading">Sign Up</h2>
      <div class="close-cart">
        <svgicon name="close" class="icon icon-close icon-grey" width="24" height="24" />
      </div>
    </div>

    <div class="input-row account-status-hide-onclick">
      <div class="btn-togglers">
        <div class="btn-toggler active" data-toggle-toggler="booked">Already booked a Tour?</div>
        <div class="btn-toggler" data-toggle-toggler="new">I'm New</div>
      </div>
    </div>

    <div data-toggle-target="booked">
      <form action="/" data-form-type="register_booked">
        <p class="descr separated">
          Please enter the email address you used to book your tour with and we’ll send you a link to reset your password.
        </p>

        <div class="input-row auto foo-validate">
          <div class="input-div input-icon md-placeholder">
            <input type="email" name="email" v-model="request_email">
            <div class="placeholder">Email Address</div>
          </div>
        </div>
        <div class="error-message"></div>
        <div class="login-sidebar-buttons">
          <button class="btn secondary compact green" >Request Account</button>
        </div>
      </form>
    </div>

    <div data-toggle-target="new">
      <form action="/" data-form-type="register">
        <input type="hidden" name="facebook_id"  id="facebook_id" value="">

        <div class="input-row auto foo-validate">
          <div class="input-div input-icon md-placeholder">
            <input type="text" name="first_name" required="required" minlength="2" v-model="firstName">
            <div class="placeholder">First Name</div>
          </div>
        </div>

        <div class="input-row auto foo-validate">
          <div class="input-div input-icon md-placeholder">
            <input type="text" name="last_name" required="required" minlength="2" v-model="lastName">
            <div class="placeholder">Last Name</div>
          </div>
        </div>

        <div class="input-row auto foo-validate">
          <div class="input-div input-icon md-placeholder">
            <input type="email" name="email" required="required" minlength="6" v-model="email">
            <div class="placeholder">Email Address</div>
          </div>
        </div>

        <div class="input-row auto item-below foo-validate">
          <div class="input-div input-icon md-placeholder">
            <input type="password" name="password" required="required" minlength="6" v-model="password">
            <div class="placeholder">Password</div>
          </div>
        </div>
      </form>
      <div class="login-sidebar-buttons">
        <div class="error-message"></div>
        <button class="btn secondary compact green" @click="createAccount">Create Account</button>
        <p class="or">or</p>
        <button class="btn secondary compact lcased facebook social-login btnLoginFacebook" data-social-action="register" @click="registerFacebook">Log In with Facebook</button>
        <button class="btn secondary compact lcased google social-login btnLoginGoogle" data-social-action="register" id="btnLoginGoogle2" @click="registerGoogle">Log In with Google</button>
      </div>
    </div>

    <div data-toggle-target="requestAcc">
      <div class="sidebar-message">
        <svgicon name="checkmark_circle" class="icon icon-checkmark_circle" />
        <div class="sidebar-heading">
          <h2 class="heading">Temporary Account Password Sent</h2>
        </div>
        <p class="descr separated">Check your email address for a password reset link, to access your account.</p>
      </div>
    </div>

    <p class="sidebar-stick-bottom">Already have an account? <a href="javascript:;" class="underlined normal top-nav-login" >Log In</a></p>
  </div>
</template>

<script>

import $ from 'jquery'

export default {
  name: 'Register',
  data () {
    return {
      request_email: '',
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  },
  mounted () {
    $('body').on('blur', '.foo-validate input', function () {
      $(this).parents('.input-div').toggleClass('valid', $(this).val() !== '')
    })

    var $toggler = $('[data-toggle-toggler]')
    var $target = $('[data-toggle-target]')

    $toggler.click(function (e) {
      e.preventDefault()
      var attr = $(this).attr('data-toggle-toggler')
      var target = $('[data-toggle-target=' + attr + ']')
      $(this)
        .parent()
        .find('[data-toggle-toggler]')
        .removeClass('active')
      $(this).addClass('active')

      $target.hide()
      $target.removeClass('active')
      target.show()
      target.css('top')
      target.addClass('active')

      if (attr === 'requestAcc' || attr === 'resetPwd') {
        $('.account-status-hide-onclick').hide()
      }
    })
  },
  methods: {
    createAccount () {
      var self = this
      console.log('create account' + this.firstName + this.lastName + this.email + this.password)
      $('body').css({cursor: 'wait'})
      this.$store.dispatch('register', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password
      }).then((response) => {
        console.log(response)
        $('body').css({cursor: 'default'})
        $('.sidebar.active').removeClass('active').hide()
        self.$store.commit('setUser')
        self.$router.push({path: '/account'})
      }, () => {
        $('body').css({cursor: 'default'})
        $('.login-sidebar-buttons .error-message').html('Invalid username/password').stop(1, 1).fadeIn()
      })
    },
    registerFacebook () {
      event.preventDefault()
      this.$store.commit('setFBUserAction', 'login')
      var self = this
      $('.login-sidebar-buttons .error-message').hide()
      $('body').css({cursor: 'wait'})
      window.FB.getLoginStatus(function (response) {
        if (response.status !== 'connected') {
          window.FB.login(function (loginResponse) {
            if (loginResponse.status === 'connected') {
              self.queryFbUser()
            } else {
              $('body').css({cursor: 'default'})
              $('.login-sidebar-buttons .error-message').html('Invalid username/password').stop(1, 1).fadeIn()
            }
          }, {scope: 'email,public_profile'})
        } else if (response.status === 'connected') {
          self.queryFbUser()
        }
      })
    },
    registerGoogle () {
      console.log('Register Google')
      $('body').css({cursor: 'wait'})
      this.$store.commit('setGUserAction', 'login')
    },
    queryFbUser () {
      var btnLogin = $('.btnLoginFacebook')
      var btnSignUp = $('#btnSignUp')
      var self = this
      window.FB.api('/me?fields=email,first_name,last_name,picture',
        function (response) {
          var user = response
          console.log(response)
          if (response && !response.error && response.email !== undefined) {
            $('#facebook_id').val(user.id)
            var userAction = self.$store.state.User.fbUserAction
            console.log('user action - ' + userAction)
            if (userAction === 'login') {
              self.$store.dispatch('fbLogin', {fbUser: user}).then(() => {
                $('body').css({cursor: 'default'})
                $('.sidebar.active').removeClass('active').hide()
                self.$store.commit('setUser')
                self.$router.push({path: '/account'})
              }, () => {
                $('.login-sidebar-buttons .error-message').html('Invalid username/password').stop(1, 1).fadeIn()
                $('body').css({cursor: 'default'})
              })
            }
          } else {
            $('body').css({cursor: 'default'})
            btnLogin.hide()
            btnSignUp.trigger('click')
            $('[name=first_name]').val(user.first_name).trigger('focus')
            $('[name=last_name]').val(user.last_name).trigger('focus')
            $('[name=email]').trigger('focus')
          }
        }
      )
    }
  }
}
</script>
