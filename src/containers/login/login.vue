<template>
  <div class="sidebar login-sidebar login-sidebar-login hidden 'active'" style="display:block">
    <div class="sidebar-heading">
      <h2 class="heading">Login</h2>
      <div class="close-cart">
        <svgicon name="close" class="icon icon-close icon-grey" width="24" height="24" />
      </div>
    </div>
    <form action="/" data-form-type="login">
      <div class="input-row auto foo-validate">
        <div class="input-div input-icon md-placeholder">
          <input type="email" name="email" v-model="email">
          <div class="placeholder">Email Address</div>
        </div>
      </div>
      <div class="input-row auto item-below foo-validate">
        <div class="input-div input-icon md-placeholder">
          <input type="password" name="password" v-model="password">
          <div class="placeholder">Password</div>
        </div>
      </div>
      <a href="javascript:;" class="underlined normal top-nav-forgot-password">Forgot your password?</a>
    </form>
    <div class="login-sidebar-buttons">
      <div class="error-message"></div>
      <button class="btn secondary compact green" @click="login">Log In</button>
      <p class="or">or</p>
      <button class="btn secondary compact lcased facebook btnLoginFacebook" data-social-action="register" @click="loginFacebook">Log In with Facebook</button>
      <button class="btn secondary compact lcased google btnLoginGoogle" data-social-action="register" id="btnLoginGoogle" @click="loginGoogle">Log In with Google</button>
    </div>
    <p class="sidebar-stick-bottom">Don't have an account? <a href="javascript:;" class="underlined normal top-nav-register" id="btnSignUp">Sign Up</a></p>
  </div>
</template>

<script>

import $ from 'jquery'
import InputField from '@/components/InputField'

export default {
  name: 'login',
  components: {
    InputField
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  mounted () {
    $('body').on('blur', '.foo-validate input', function () {
      $(this).parents('.input-div').toggleClass('valid', $(this).val() !== '')
    })
  },
  methods: {
    login (event) {
      var self = this
      console.log('login' + this.email + ' ' + this.password)
      $('.login-sidebar-buttons .error-message').hide()
      $('body').css({cursor: 'wait'})
      this.$store.dispatch('login', {email: this.email, password: this.password}).then(() => {
        $('body').css({cursor: 'default'})
        $('.sidebar.active').removeClass('active').hide()
        self.$store.commit('setUser')
        self.$router.push({path: '/account'})
      }, () => {
        $('body').css({cursor: 'default'})
        $('.login-sidebar-buttons .error-message').html('Invalid username/password').stop(1, 1).fadeIn()
      })
    },
    loginFacebook () {
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
    loginGoogle (event) {
      event.preventDefault()
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
                $('body').css({cursor: 'default'})
                $('.login-sidebar-buttons .error-message').html('Invalid username/password').stop(1, 1).fadeIn()
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
