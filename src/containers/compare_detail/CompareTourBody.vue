<template>
  <div class="compare-tours-body">
    <CompareRowItem
      v-for="field in fields"
      v-bind:key="field.key"
      :title="field.title"
      :inline="field.inline"
      :values="getValueArray(field.key)"
      :itemType="field.itemType"
    />
    <CompareRowItem
      v-for="(visit, index) in getCpSiteVisits()"
      v-bind:key="index"
      :title="getVisitTitle(index)"
      :inline="true"
      :values="getVisitArray(visit)"
      itemType="sitesVisited"
    />
    <CompareRowItem
      title=""
      :inline="true"
      :values="getValueArray('book')"
      itemType="book"
    />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import CompareRowItem from '@/components/CompareRowItem'

export default {
  name: 'CompareTourBody',
  props: {
    tours: {
      type: Array,
      required: true
    }
  },
  components: {
    CompareRowItem
  },
  computed: {
    ...mapGetters([
      'compareTag'
    ])
  },
  data () {
    return {
      fields: [
        {
          title: 'Who It&#39;s For',
          key: 'whoFor',
          inline: false,
          itemType: 'description'
        },
        {
          title: 'Who It&#39;s Not For',
          key: 'whoNotFor',
          inline: false,
          itemType: 'description'
        },
        {
          title: 'Adult Price',
          key: 'price',
          inline: true,
          itemType: ''
        },
        {
          title: 'Rating',
          key: 'reviewsAverage',
          inline: true,
          itemType: 'rating'
        },
        {
          title: 'Departs At',
          key: 'startTime',
          inline: true,
          itemType: ''
        },
        {
          title: 'Duration',
          key: 'duration',
          inline: true,
          itemType: ''
        },
        {
          title: 'Group Size',
          key: 'groupSize',
          inline: true,
          itemType: ''
        }
      ]
    }
  },
  methods: {
    getVisitTitle (index) {
      if (index === 0) {
        return 'Sites Visited'
      } else {
        return ''
      }
    },
    getVisitArray (visit) {
      var array = []
      for (let index in this.tours) {
        let tour = this.tours[index]
        var sitesVisited = tour.sitesVisited.split(',')
        var visits = []
        for (var i = 0; i < sitesVisited.length; i++) {
          if (sitesVisited[i].slice(0, 1) === ' ') {
            visits.push(sitesVisited[i].slice(1, sitesVisited[i].length))
          } else {
            visits.push(sitesVisited[i])
          }
        }
        var bFind = false
        for (var j = 0; j < visits.length; j++) {
          if (visits[j] === visit) {
            bFind = true
            array.push(visit)
          }
        }
        if (bFind === false) {
          array.push(null)
        }
      }
      return array
    },
    getCpSiteVisits () {
      var cpSiteVisited = this.$store.getters.compareTag.sitesVisited.split(',')
      var visits = []
      for (var i = 0; i < cpSiteVisited.length; i++) {
        var cpSite = cpSiteVisited[i]
        if (cpSite.length !== 0) {
          if (cpSite.slice(0, 1) === ' ') {
            visits.push(cpSite.slice(1, cpSite.length))
          } else {
            visits.push(cpSite)
          }
        }
      }
      return visits
    },
    getValueArray (key) {
      let array = []
      if (key === 'price') {
        for (let index in this.tours) {
          let tour = this.tours[index]
          var priceVal = 0
          switch (this.$store.state.Common.currency) {
            case 'USD':
              priceVal = '$' + tour.price.data.adults_price.USD
              break
            case 'EUR':
              priceVal = '€' + tour.price.data.adults_price.EUR
              break
            case 'GBP':
              priceVal = '£' + tour.price.data.adults_price.GBP
              break
            case 'CAD':
              priceVal = '$' + tour.price.data.adults_price.CAD
              break
            case 'AUD':
              priceVal = '$' + tour.price.data.adults_price.AUD
              break
          }
          array.push(priceVal)
        }
      } else if (key === 'reviewsAverage') {
        for (let index in this.tours) {
          let tour = this.tours[index]
          array.push(tour.review_status.data.feedback_average)
        }
      } else if (key === 'book') {
        for (let index in this.tours) {
          let tour = this.tours[index]
          let ref = '/' + tour.citySlug + '/' + tour.slug
          array.push(ref)
        }
      } else if (key !== '') {
        for (let index in this.tours) {
          let tour = this.tours[index]
          array.push(tour[key])
        }
      }
      console.log(array)
      return array
    }
  }
}
</script>