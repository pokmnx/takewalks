<template>
  <div>
    <h4 class="input-row-heading">Connected Social Accounts</h4>
    <ConnectSocial
      socialName="facebook"
      :status="facebook.status"
      :socialProviderId="facebook.socialProviderId"
      :socialUserId="facebook.socialUserId"
    />
    <ConnectSocial
      socialName="google"
      :status="google.status"
      :socialProviderId="google.socialProviderId"
      :socialUserId="google.socialUserId"
    />
  </div>
</template>

<script>

import ConnectSocial from '@/components/ConnectSocial'

export default {
  name: 'SocialConnect',
  components: {
    ConnectSocial
  },
  props: {
    facebook: {
      type: Object,
      required: true
    },
    google: {
      type: Object,
      required: true
    }
  }
}
</script>
