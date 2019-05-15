<template>
  <div class="topnav-item" :data-country-toggler="continent">
    <a href="#" class="link">{{ continent }}</a>
    <div class="topnav-dropdown cities-container" :data-country-target="continent">
      <div class="inner">
        <div class="inner-list">
          <router-link
            v-for="(city, index) in cities"
            v-bind:index="index"
            v-bind:key="city.name"
            :to="city.router"
            >
            {{ city.name }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CityList',
  props: {
    continent: {
      type: String,
      required: true
    },
    cities: {
      type: Array,
      required: true
    }
  }
}
</script>

