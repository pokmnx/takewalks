<template>
  <div class="container">
    <section class="bordered">
      <div class="sustainable-travel">
        <div class="text">
          <div class="green-circle">
            <svgicon name="staff_pick" color="#fff" width="40" height="40" />
          </div>
          <div class="section-title left">
            <h5 class="subtitle green">Staff Pick</h5>
            <h2 class="section-heading small">{{ featureTour.featuredTourTitle }}</h2>
            <p class="descr" v-html="featureTour.featuredTourDescription" />
            <router-link v-if="featureTour"  :to="'/' + featureTour.featuredTourURL + '/'" class="btn primary green">
              Learn More
            </router-link>
          </div>
        </div>
        <div class="img">
          <a v-if="featureTour !== undefined" :href="'/' + featureTour.featuredTourURL + '/'">
            <img
              :src="featureTour.featuredTourHeroImage + '?w=1300'"
              :src-placeholder="featureTour.featuredTourHeroImage + '?w=80'"
            />
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import VLazyImage from 'v-lazy-image'

export default {
  name: 'StaffPicker',
  components: {
    VLazyImage
  },
  computed: {
    ...mapGetters([
      'featureTour'
    ])
  }
}
</script>
