<template>
   <div class="topnav-item help" >
    <a href="#" class="btn primary purple link">{{ label }}</a>
    <div class="topnav-dropdown cities-container">
      <div class="inner">
        <div class="inner-list">
          <template v-for="(option, index) in options">
            <router-link v-if="option.relativePath" v-bind:index="index" v-bind:key="option.name" :to="option.route">{{ option.name }}</router-link>
            <a v-else v-bind:index="index" v-bind:key="option.name" v-bind:href="option.route" :target="!option.relativePath ? '_blank' : '_self'">{{ option.name }}</a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpOptions',
  props: {
    label: {
      type: String,
      default: 'Help'
    },
    options: {
      type: Array,
      required: true
    }
  }
}
</script>

