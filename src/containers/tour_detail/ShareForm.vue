<template>
  <div class="right-book-wishlist">
    <div style="display:none">
      <button class="btn primary condensed add-wishlist green has-icon"><i class="icon icon-star_transparent"></i>Add to Wishlist</button>
    </div>
    <div>
      <h5 class="subtitle black">SHARE</h5>
      <a :href="getEmailShare()"><svgicon name="email" color="#c4c9ce" width="16" height="16" class="icon icon-grey icon-email" /></a>
      <a :href="getTwitterShare()" onclick="window.open('','popup','width=600,height=600'); return false;" target="popup" title="Tweet about this tour">
        <svgicon name="twitter" color="#c4c9ce" class="icon icon-grey icon-twitter" width="16" height="16" />
      </a>
      <a :href="getFacebookShare()" onclick="window.open('','popup','width=600,height=600'); return false;" target="popup" title="Share this tour on Facebook">
        <svgicon name="facebook" color="#c4c9ce" class="icon icon-grey icon-facebook" width="16" height="16" />
      </a>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'ShareForm',
  computed: {
    ...mapGetters([
      'tour'
    ])
  },
  data () {
    return {
      twitterShare: 'https://twitter.com/intent/tweet?url=$canonicalURL&amp;text=',
      facebookShare: 'https://www.facebook.com/share.php?u=',
      emailShare: 'mailto:info@walks.com?cc=info@walks.com&bcc=info@walks.com'
    }
  },
  methods: {
    getBaseURL () {
      return 'https://takewalks.com'
    },
    getEmailShare () {
      var emailShare = 'mailto:?&subject=The subject of the email&body=Lets go to &#39;'
      emailShare += this.tour.shortTitle + ' '
      emailShare += this.getBaseURL() + this.$route.fullPath
      return emailShare
    },
    getFacebookShare () {
      var facebookShare = 'http://www.facebook.com/share.php?u='
      facebookShare += this.getBaseURL() + this.$route.fullPath
      return facebookShare
    },
    getTwitterShare () {
      var twitterShare = 'https://twitter.com/intent/tweet?url=' + this.getBaseURL() + this.$route.fullPath + '&'
      twitterShare += 'text=Join me at&#39;' + this.tour.shortTitle + '&#39;'
      return twitterShare
    }
  }
}
</script>
