<template>
  <div :class="getMainClass()">
    <div class="container">
      <div class="compare-row-title" v-html="this.title"></div>
      <div
        :class="getRowItemClass()"
        v-for="(value, index) in this.values"
        v-bind:key="index"
      >
        <p v-if="itemType === 'description'" class="descr" v-html="value"></p>
        <router-link v-else-if="itemType === 'book'" :to="value" class="btn secondary purple lcased">Book Now</router-link>
        <div v-else-if="itemType === 'rating'" class="tour-box-reviews">
          <svgicon :name="getRatingIconName(value, 1)" :class="getRatingIconClass(value, 1)" width="20" height="20" />
          <svgicon :name="getRatingIconName(value, 2)" :class="getRatingIconClass(value, 2)" width="20" height="20" />
          <svgicon :name="getRatingIconName(value, 3)" :class="getRatingIconClass(value, 3)" width="20" height="20" />
          <svgicon :name="getRatingIconName(value, 4)" :class="getRatingIconClass(value, 4)" width="20" height="20" />
          <svgicon :name="getRatingIconName(value, 4.7)" :class="getRatingIconClass(value, 4.7)" width="20" height="20" />
        </div>
        <div v-else-if="itemType === 'sitesVisited'">
          <div v-if="value">{{ value }}</div>
          <div v-else><svgicon name="close" class="icon icon-close" width="16" height="16" /></div>
        </div>
        <div v-else>
          {{ value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompareRowItem',
  props: {
    title: {
      type: String,
      required: true
    },
    inline: Boolean,
    values: {
      type: Array,
      required: true
    },
    itemType: String
  },
  methods: {
    getMainClass () {
      return this.inline ? 'compare-row inline' : 'compare-row'
    },
    getRowItemClass () {
      console.log(this.itemType)
      if (this.itemType === 'description') return 'compare-row-item text-center'
      else if (this.itemType === 'rating') return 'compare-row-item'
      else return 'compare-row-item'
    },
    getRatingIconName (value, baseScore) {
      if (value >= baseScore) return 'star_active'
      else return 'star'
    },
    getRatingIconClass (value, baseScore) {
      return 'icon icon-' + this.getRatingIconName(value, baseScore)
    }
  }
}
</script>