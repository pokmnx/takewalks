<template>
  <a target="_blank" :href="link">
    <div :class="getClass()">
      <svgicon :name="name" width="22" height="22"></svgicon>
    </div>
  </a>
</template>

<script>
export default {
  name: 'SocialLink',
  props: {
    link: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    getClass () {
      return 'icon icon-' + this.name
    }
  }
}
</script>
