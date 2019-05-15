<template>
  <div
    :class="[imageClass, imageState]"
    :style="computedStyle" 
    :data-width="imageWidth" 
    :data-height="imageHeight"
    :data-state="imageState"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'LazyBackground',
  props: {
    imageSource: {
      type: String,
      required: true
    },
    imageClass: {
      type: String,
      required: false,
      default: ''
    },
    loadingImage: {
      type: String,
      required: true
    },
    backgroundSize: {
      type: String,
      required: false,
      default: 'cover'
    }
  },
  computed: {
    computedStyle () {
      if (this.imageState === 'loading') {
        return 'background-image: url(' + this.loadingImage + '); background-size: ' + this.backgroundSize
      }
      if (this.imageState === 'loaded') {
        return 'background-image: url(' + this.asyncImage.src + '); background-size: ' + this.backgroundSize
      }
      return ''
    }
  },
  methods: {
    fetchImage (url) {
      this.asyncImage.onload = this.imageOnLoad
      this.imageState = 'loading'
      this.asyncImage.src = this.secureImageUrl
    },
    imageOnLoad () {
      this.imageState = 'loaded'
      this.imageWidth = this.asyncImage.naturalWidth
      this.imageHeight = this.asyncImage.naturalHeight
    }
  },
  mounted () {
    this.$nextTick(() => {
      // Image() constructor is not reading relative protocols, instead using http:// for all calls to image.src
      // Basic regex replaces to force https
      this.secureImageUrl = this.imageSource
      this.secureImageUrl = this.secureImageUrl.replace(/^https?:\/\//i, '')
      this.secureImageUrl = this.secureImageUrl.replace(/^\/\//i, '')
      this.secureImageUrl = 'https://' + this.secureImageUrl
      this.fetchImage()
    })
  },
  data () {
    return {
      imageWidth: 0,
      imageHeight: 0,
      imageState: 'loading',
      secureImageUrl: '',
      asyncImage: new Image()
    }
  }
}
</script>

