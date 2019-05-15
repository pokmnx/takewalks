<template>
  <div>
    <AccountHeader
      :user="user"
      selectedPage="settings"
    />
    <section class="compact grey bordered">
      <div class="container">
        <div class="paired-fields">
          <div class="left">
            <SocialConnect
              :facebook="socialProvider.facebook"
              :google="socialProvider.google"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="compact bordered">
      <div class="container">
        <div class="paired-fields">
          <div class="left">
            <form id="form-edit" class="formSubmit">
              <h4 class="input-row-heading">Edit Account Information</h4>
              <input type="hidden" name="id" :value="user.id">
              <InputField type="text" name="first_name" :value="firstName" v-model="firstName" required="required" placeholder="First Name" />
              <InputField type="text" name="last_name" :value="lastName" v-model="lastName" required="required" placeholder="Last Name" />
              <InputField type="email" name="email" :value="email" v-model="email" required="required" placeholder="Email" /> 
              <InputField type="tel" name="mobile_number" :value="mobileNumber" v-model="mobileNumber" placeholder="Phone" />
            </form>
            <div class="error-message"></div>
            <div class="center-btn">
              <button class="btn secondary green" type="submit" @click="changeUserInfo">Save Changes</button>
            </div>
          </div>
          <div class="right">
            <form id="form-change-pass" class="formSubmit" autocomplete="off">
              <h4 class="input-row-heading">Change Password</h4>
              <InputField type="password" name="passwordOld" v-model="passwordOld" required="required" placeholder="Old Password" />
              <InputField type="password" id="password1" name="passwordNew" v-model="passwordNew" required="required" minlength="6" placeholder="Create New Password" />
              <InputField type="password" id="password2" name="passwordNewVerify" v-model="passwordNewVerify" required="required" minlength="6" placeholder="Confirm New Password" />
            </form>
            <div class="error-message"></div>
            <div class="center-btn">
              <button class="btn secondary green" type="submit" @click="changePassword">Change Password</button>
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
import SocialConnect from '@/containers/account/SocialConnect'
import InputField from '@/components/InputField'
import { mapGetters } from 'vuex'

export default {
  name: 'SettingsPage',
  components: {
    AccountHeader,
    SocialConnect,
    InputField
  },
  computed: {
    ...mapGetters([
      'user',
      'socialProvider'
    ])
  },
  data () {
    return {
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      passwordOld: '',
      passwordNew: '',
      passwordNewVerify: ''
    }
  },
  mounted () {
    $('#launcher').removeClass('launcher-detail')
    this.firstName = this.$store.state.User.user.fname
    this.lastName = this.$store.state.User.user.lname
    this.email = this.$store.state.User.user.email
    this.mobileNumber = this.$store.state.User.user.mobile_number

    $('body').css({cursor: 'wait'})
    this.$store.dispatch('getSocialProvider').then(() => {
      $('body').css({cursor: 'default'})
    })
    setTimeout(function () {
      $('#form-edit').find('input').each(function (i, e) { $(e).trigger('focus') })
      window.scrollTo(0, 0)
      $('body').on('blur', '.foo-validate input', function () {
        $(this).parents('.input-div').toggleClass('valid', $(this).val() !== '')
      })
    }, 100)
    document.dispatchEvent(new Event('render-event'))
  },
  methods: {
    addForm (selector, template) {
      var container = $(selector)
      container.append('<div></div>')
      $('.remove-form').click(this.removeForm)
      $('.input-div').addClass('valid')
      $('body').on('blur', '.foo-validate input', function () {
        $(this).parents('.input-div').toggleClass('valid', $(this).val() !== '')
      })
    },
    removeForm (event) {
      event.preventDefault()
      $(this).parent().remove()
    },
    changeUserInfo (event) {
      var self = this
      console.log('change user information')
      console.log(this.firstName + ' ' + this.lastName + ' ' + this.email + ' ' + this.mobileNumber)
      $('body').css({cursor: 'wait'})
      $('.left .error-message').hide()
      $('.right .error-message').hide()
      $('.left .center-btn [type=submit]').html('Save Changes')
      $('.right .center-btn [type=submit]').html('Change Password')
      this.$store.dispatch('updateUserInfo', {firstName: this.firstName, lastName: this.lastName, email: this.email, phone: this.mobileNumber}).then(() => {
        $('body').css({cursor: 'default'})
        self.showComplete('left')
      }, error => {
        console.log(error)
        $('body').css({cursor: 'default'})
        self.showErrorMessage('left', error.message)
      })
    },
    changePassword (event) {
      var self = this
      console.log('change password')
      console.log(this.passwordOld + ' ' + this.passwordNew)
      $('body').css({cursor: 'wait'})
      $('.left .error-message').hide()
      $('.right .error-message').hide()
      $('.left .center-btn [type=submit]').html('Save Changes')
      $('.right .center-btn [type=submit]').html('Change Password')

      this.$store.dispatch('updatePassword', {currentPassword: this.passwordOld, newPassword: this.passwordNew}).then(() => {
        $('body').css({cursor: 'default'})
        self.showComplete('right')
      }, error => {
        console.log(error)
        $('body').css({cursor: 'default'})
        self.showErrorMessage('right', error.message)
      })
    },
    showErrorMessage (target, message) {
      if (target === 'left') {
        $('.left .error-message').html(message).stop(1, 1).fadeIn()
      } else {
        $('.right .error-message').html(message).stop(1, 1).fadeIn()
      }
    },
    showComplete (target) {
      if (target === 'left') {
        $('.left .center-btn [type=submit]').html('DONE!')
      } else {
        $('.right .center-btn [type=submit]').html('DONE!')
      }
    }
  }
}
</script>
