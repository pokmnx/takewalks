<template>
  <a
    href="#"
    :class="getClass()"
    v-bind:key="title"
    :data-toggle-toggler="point"
    v-on:click.prevent="clickItem"
  >
    <svgicon :name="iconName" width="34" height="34"></svgicon>
    <span>{{ title }}</span>
  </a>
</template>

<script>
export default {
  name: 'FeatureTabBarItem',
  props: {
    title: String,
    point: String,
    iconName: String,
    active: Boolean
  },
  methods: {
    getClass () {
      return 'tab-item ' + (this.active ? 'active' : '')
    },
    clickItem (event) {
      const children = this.$parent.$children
      for (const index in children) {
        children[index].$el.classList.remove('active')
      }
      event.currentTarget.classList.add('active')
      const currentAttrValue = event.currentTarget.getAttribute('data-toggle-toggler')
      for (const index in children) {
        const el = children[index].$el
        const attrValue = el.getAttribute('data-toggle-target')
        if (attrValue === currentAttrValue) {
          el.classList.add('active')
          break
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '../assets/sass/_mixins.scss';
  @import '../assets/sass/_variables.scss';
  span {
    @include min-width(1024px) {
      margin-top: 16px;
    }
    @include max-width(768px) {
      margin-left: 14px;
    }
  }
</style>


