<template>
  <div class="guide-box" style="min-height:167px; margin-bottom: 35px;">
    <div class="avatar" :style="avatarStyle()"></div>
    <div>
        <h2>{{ name }}</h2>
        <h5 v-show="city" class="subtitle green">{{ city + ", " + country }}</h5>
        <p v-html="description" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CountryBox',
  props: {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    city: String,
    country: String,
    avatar: {
      type: String,
      required: true
    }
  },
  methods: {
    avatarStyle () {
      return 'background: url(' + this.avatar + '?w=300) no-repeat 85% 50%/cover; '
    }
  }
}
</script>

