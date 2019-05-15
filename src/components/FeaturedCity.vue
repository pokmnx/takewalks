<template>
  <router-link
    :to="getRouteURL()"
    class="place"
  >
    <LazyBackground
      class="place-img"
      :imageSource="secureImageUrl + '?w=810'"
      :loadingImage="secureImageUrl + '?w=80'"
    >
      <div class="place-img" style="background: linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4))">
      </div>
    </LazyBackground>
    <div class="place-caption">
      <h3 class="header">{{ name }}</h3>
    </div>
  </router-link>
</template>

<script>

import LazyBackground from '@/components/LazyBackground'

export default {
  name: 'FeaturedCity',
  components: {
    LazyBackground
  },
  props: {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },
  computed: {
    secureImageUrl: function () {
      // Make sure we are using a secure image url
      let url = this.image
      url = url.replace(/^https?:\/\//i, '')
      url = 'https://' + url
      return url
    }
  },
  methods: {
    getRouteURL: function () {
      return this.name.replace(' ', '-').toLowerCase() + '-tours/'
    }
  }
}
</script>

