<template>
  <div
    :class="getClass()"
    :data-tour-id="this.tour.event_id"
  >
    <router-link class="tour-box-content" :to="'/' + tour.citySlug + '/' + tour.slug + '/'">
      <TourAvatar
        :tour="this.tour"
      />
      <TourDetail
        :tour="this.tour"
      />
    </router-link >
  </div>
</template>

<script>

// import $ from 'jquery'
import TourAvatar from '@/components/TourAvatar'
import TourDetail from '@/components/TourDetail'

export default {
  name: 'TourContainer',
  components: {
    TourAvatar,
    TourDetail
  },
  props: {
    tour: {
      type: Object,
      required: true
    },
    tourCounter: Number,
    compareIndex: Number,
    similarView: Boolean
  },
  methods: {
    getReference () {
      return '/' + this.tour.citySlug + '/' + this.tour.slug
    },
    getClass () {
      return this.tour.discount !== '0' ? 'tour-box col' : 'tour-box col'
    },
    // getClass () {
    //   return this.tour.discount !== '0' ? 'tour-box col discounted' : 'tour-box col'
    // },
    getCompareID () {
      return 'cb' + this.compareIndex
    }
  },
  secondVisit: false,
  mounted () {
    // var self = this
    // this.secondVisit = false
    // $('[data-tour-id=' + this.tour.event_id + ']').off('click').click(function (e) {
    //   var target = $(e.target)
    //   var compare = ($('[data-tour-id=' + self.tour.event_id + '] .compare-cb').find('label'))
    //   if (self.secondVisit === false) {
    //     self.secondVisit = true
    //     if (target[0] === undefined || target[0].control === undefined) {
    //       self.$router.push({path: self.getReference()})
    //     } else if (compare[0] === undefined || compare[0].control === undefined) {
    //       self.$router.push({path: self.getReference()})
    //     } else if (target[0].control !== compare[0].control) {
    //       self.$router.push({path: self.getReference()})
    //     }
    //   } else {
    //     self.secondVisit = false
    //   }
    // })
  }
}
</script>
