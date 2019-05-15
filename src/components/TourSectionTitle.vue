<template>
  <div class="tour-type-title">
    <img :src="tag.tagIcon">
    <h2 class="section-heading">{{ this.tag.name }}</h2>
    <p class="descr desktop-only">{{ this.tag.description }}</p>
  </div>
</template>

<script>
export default {
  name: 'TourSectionTitle',
  props: {
    tag: {
      type: Object,
      required: true
    }
  },
  methods: {
    getIconName () {
      let preStr = this.tag.name.replace(/[^\w\s]/gi, '').toLowerCase()
      return preStr.replace(new RegExp(' ', 'g'), '-').toLowerCase()
    },
    getIconClass () {
      return 'icon icon-' + this.getIconName()
    }
  }
}
</script>

