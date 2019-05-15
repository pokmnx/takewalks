<template>
  <LazyBackground
    class="heroContainer"
    :imageSource="heroImageObj().src"
    :loadingImage="heroImageObj().loading"
  >
    <div class="hero" style="background-image: linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3))">
      <h1>{{ heroTitle }}</h1>
      <p>{{ heroDescription }}</p>
    </div>
  </LazyBackground>
</template>

<script>

import { mapGetters } from 'vuex'
import LazyBackground from '@/components/LazyBackground'

export default {
  name: 'Hero',
  data () {
    return {
      background: 'linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3)), url(https://images.contentful.com/twizyp0t114t/640NbkTSFi40cSWsEcWgaY/611cd9885bf97448b2bc9115bed983cf/Paris-SW-4480.jpg?w=2000)'
    }
  },
  components: {
    LazyBackground
  },
  computed: {
    ...mapGetters([
      'heroTitle',
      'heroDescription',
      'heroImage'
    ])
  },
  methods: {
    heroImageObj () {
      return {
        src: 'https://' + this.heroImage + '?w=2000',
        loading: 'https://' + this.heroImage + '?w=80'
      }
    }
  }
}
</script>

