<template>
  <div :class="getContainerClass()">
    <div :class="getSocialClass('icon-circle share connect-social')">
      <svgicon :name="socialName" :class="getIconClass()" :width="getIconWidth()" :height="getIconWidth()" />
      <div class="connect-success">
        <svgicon name="checkmark" class="icon icon-checkmark" width="10" height="10" style="left: 0px;" />
      </div>
    </div>
    <span>{{ status }}</span>
    <a :class="getButtonClass()" data-social-action="connect" data-connect @click="connect">Connect {{ socialName.substr(0, 1).toUpperCase() + socialName.substr(1) }}</a>
    <button :class="getSocialClass('btn secondary compact lcased')" type="submit" data-disconnect @click="disconnect">Disconnect {{ socialName.substr(0, 1).toUpperCase() + socialName.substr(1) }}</button>
  </div>
</template>

<script>

import $ from 'jquery'
import { mapGetters } from 'vuex'

export default {
  name: 'ConnectSocial',
  props: {
    socialName: String,
    status: String,
    socialProviderId: Number,
    socialUserId: String
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  mounted () {
    if (this.socialName === 'google') {
      var btnGoogleLogin = $('[data-social-action=connect]')[1]
      var self = this
      this.$store.state.User.googleAuth2.attachClickHandler(btnGoogleLogin, {}, function (googleUser) {
        console.log(googleUser)
        var user = googleUser.getBasicProfile()
        self.$store.dispatch('addSocialProvider', {
          provider: 'google',
          socialUserId: user.getId()
        }).then(() => {
          $('body').css({cursor: 'default'})
        }, error => {
          console.log(error)
          $('body').css({cursor: 'default'})
        })
      })
    }
  },
  methods: {
    queryFbUser () {
      var self = this
      window.FB.api('/me?fields=email,first_name,last_name,picture',
        function (response) {
          var user = response
          if (response && !response.error && response.email !== undefined) {
            self.$store.dispatch('addSocialProvider', {provider: 'facebook', socialUserId: user.id}).then(() => {
              $('body').css({cursor: 'default'})
            }, error => {
              console.log(error)
              $('body').css({cursor: 'default'})
            })
          } else {
            $('body').css({cursor: 'default'})
          }
        }
      )
    },
    connect () {
      var self = this
      if (this.socialName === 'google') {
        $('body').css({cursor: 'wait'})
      } else {
        $('body').css({cursor: 'wait'})
        window.FB.getLoginStatus(function (response) {
          if (response.status !== 'connected') {
            window.FB.login(function (loginResponse) {
              if (loginResponse.status === 'connected') {
                self.queryFbUser()
              } else {
                $('body').css({cursor: 'default'})
              }
            }, {scope: 'email,public_profile'})
          } else if (response.status === 'connected') {
            self.queryFbUser()
          }
        })
      }
    },
    disconnect () {
      console.log('disconnect action')
      $('body').css({cursor: 'wait'})
      this.$store.dispatch('removeSocialProvider', {socialProviderId: this.socialProviderId}).then(() => {
        $('body').css({cursor: 'default'})
      }, error => {
        console.log(error)
        $('body').css({cursor: 'default'})
      })
    },
    getContainerClass () {
      if (this.status === 'Connected') {
        return 'connect-social-acc connected'
      } else {
        return 'connect-social-acc ' + this.socialName
      }
    },
    getIconWidth () {
      if (this.socialName === 'facebook') {
        return '24'
      } else {
        return '30'
      }
    },
    getIconClass () {
      return 'icon icon-' + this.socialName
    },
    getSocialClass (oldClass) {
      return oldClass + ' ' + this.socialName
    },
    getFormID () {
      return 'form-social-' + this.socialName
    },
    getButtonClass () {
      return 'btn secondary compact lcased ' + this.socialName + ' btnLogin' + this.socialName.substr(0, 1).toUpperCase() + this.socialName.substr(1)
    }
  }
}
</script>
