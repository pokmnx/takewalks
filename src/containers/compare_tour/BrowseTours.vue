<template>
  <section class="bordered" id="browseTours" data-scroll-target="browseTours">
    <div class="container list-multiple-rows">
      <SubjectTitle
        title="Browse Tours"
        iconName="browse-tours"
      />
      <div class="tour-list-items vertical">
        <TourContainer
          v-for="(tour, index) in this.tours"
          v-bind:key="tour.name"
          :tour="tour"
          :tourCounter="getTourCount"
          :compareIndex="index"
          :similarView="false"
        />
      </div>      
    </div>
  </section>
</template>

<script>

import SubjectTitle from '@/components/SubjectTitle'
import TourContainer from '@/containers/tour/TourContainer'

export default {
  name: 'BrowseTours',
  components: {
    SubjectTitle,
    TourContainer
  },
  props: {
    tours: {
      type: Array,
      required: true
    }
  },
  computed: {
    getTourCount () {
      return this.tours.length
    }
  }
}
</script>
