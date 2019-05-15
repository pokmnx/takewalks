<template>
  <div :class="getClass()" :data-toggle-target="target">
    <div class="plan-trip-wrap">
      <div class="section-title left">
        <h2 class="section-heading small">{{ title }}</h2>
        <p class="descr" v-html="description" />
      </div>
      <div class="plan-img">
        <img :src="imageURL[1]" alt="" class="bottom-left">
        <img :src="imageURL[0]" alt="" class="center">
        <img :src="imageURL[2]" alt="" class="top-right">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeatureTabContent',
  props: {
    title: String,
    description: String,
    target: String,
    imageURL: Array,
    active: Boolean
  },
  methods: {
    getClass () {
      return 'tab-content slow ' + (this.active ? 'active' : '')
    }
  }
}
</script>

