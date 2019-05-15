<template>
  <section>
    <div class="container">
      <SubjectTitle 
        title="Take Walks With Confidence"
        subTitle="OUR PROMISE TO YOU"
        description="Wherever in the world you take walks with us, some things are always the same."
        iconName="walk"
      />
      <div class="tabs with-icon">
        <FeatureTabBarItem
          v-for="point in points"
          v-bind:key="point.point"
          v-bind="point"
        />
      </div>
      <FeatureTabContent
        v-for="point in points"
        v-bind:key="point.point"
        v-bind="{title:point.title, description: point.description, target: point.point, imageURL: point.imageURL, active: point.active}"
      />
    </div>
  </section>
</template>

<script>

import { mapGetters } from 'vuex'
import SubjectTitle from '@/components/SubjectTitle'
import FeatureTabBarItem from '@/components/FeatureTabBarItem'
import FeatureTabContent from '@/components/FeatureTabContent'

export default {
  name: 'Features',
  components: {
    SubjectTitle,
    FeatureTabBarItem,
    FeatureTabContent
  },
  computed: {
    ...mapGetters([
      'sellingPoints'
    ]),
    points () {
      var sPoints = []
      var icons = ['small_groups-active', 'best_local_guides-active', 'guaranteed_departures-active', 'best_access-active']
      var sellingPoints = this.$store.state.Home.sellingPoints
      for (var index in sellingPoints) {
        var active = false
        if (index === '0') active = true
        var images = []
        images.push(sellingPoints[index].image + '?w=600')
        images.push(sellingPoints[(index + 1) % sellingPoints.length].image + '?w=600')
        images.push(sellingPoints[(index + 2) % sellingPoints.length].image + '?w=600')
        sPoints.push({
          title: sellingPoints[index].title,
          iconName: icons[index],
          point: 'sellingPoint' + (index + 1),
          description: sellingPoints[index].description,
          active: active,
          imageURL: images
        })
      }
      return sPoints
    }
  }
}
</script>

