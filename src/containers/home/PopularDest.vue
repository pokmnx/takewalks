<template>
  <section class="bordered">
    <div class="container">
      <SubjectTitle
        title="Most Popular Destinations"
        description="We take walks all over the world. These are just a few of our favourite destinations."
        iconName="most-popular-destinations"
      />
      <div class="places-wrap">
        <div class="places first">
          <FeaturedCity
            v-for="(city, index) in featuredCities"
            :key="city.name"
            v-if="index < 2"
            v-bind="city"
          />
        </div>
        <div class="places second">
          <FeaturedCitySecond
            v-for="(city, index) in featuredCities"
            :key="city.name"
            v-if="index >= 2"
            v-bind="city"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>

import { mapGetters } from 'vuex'
import SubjectTitle from '@/components/SubjectTitle'
import FeaturedCity from '@/components/FeaturedCity'
import FeaturedCitySecond from '@/components/FeaturedCitySecond'

export default {
  name: 'PopularDest',
  components: {
    SubjectTitle,
    FeaturedCity,
    FeaturedCitySecond
  },
  computed: {
    ...mapGetters([
      'featuredCities'
    ])
  },
  methods: {
    cityImageStyle: function (url) {
      return 'background: linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), url(' + url + '?w=1200) no-repeat 50% 50%/cover;'
    },
    getRouteURL: function (cityName) {
      return cityName.replace(' ', '-').toLowerCase() + '-tours'
    }
  }
}
</script>

