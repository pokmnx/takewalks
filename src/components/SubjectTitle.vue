<template>
  <div :class="getClass()">
    <svgicon :name="iconName" width="50" height="50" :class="getIconClass()"></svgicon>
    <h2 class="section-heading">{{ title }}</h2>
    <h5 class="subtitle purple separated-top">{{ subTitle }}</h5>
    <p class="descr">{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: 'SubjectTitle',
  props: {
    title: {
      type: String,
      required: true
    },
    subTitle: {
      type: String
    },
    description: {
      type: String
    },
    iconName: {
      type: String,
      required: true
    },
    small: Boolean
  },
  methods: {
    getIconClass () {
      return 'icon icon-' + this.iconName
    },
    getClass () {
      return this.small ? 'section-title small center' : 'section-title center'
    }
  }
}
</script>

