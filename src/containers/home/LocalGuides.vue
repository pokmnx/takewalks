<template>
  <section class="bordered">
    <div class="container">
      <SubjectTitle 
        title="Meet Our Local Tour Guides"
        :description="subHeading"
        iconName="tour_guides"
      />
      <div class="carousel-wrapper">
        <div class="guides-wrap single-item" data-slick='{"dots": false, "arrows": true}'>  
          <div class="col" style="width:432px !important; margin-left:10px !important; margin-right:10px !important;"
            v-for="guide in tourGuides"
            v-bind:key="guide.name"
          >
            <GuideBox v-bind="guide"/>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

import $ from 'jquery'
import { mapGetters } from 'vuex'
import SubjectTitle from '@/components/SubjectTitle'
import GuideBox from '@/components/GuideBox'

require('@/lib/slick.min.js')

export default {
  name: 'LocalGuides',
  components: {
    SubjectTitle,
    GuideBox
  },
  computed: {
    ...mapGetters([
      'subHeading',
      'tourGuides'
    ])
  },
  mounted () {
    if (this.tourGuides.length > 0) {
      console.log('Slick Initialized')
      $('.single-item').slick({
        centerMode: true,
        prevArrow: '<i class="icon icon-arrow_left" style="position:absolute; top: 40%; left: -40px; cursor:pointer; color: #d9dde2;  font-size: 30px;"></i>',
        nextArrow: '<i class="icon icon-arrow_left" style="position:absolute; top: 40% !important; transform: rotate(180deg); right: -40px; cursor:pointer;color: #d9dde2; font-size: 30px;"></i>',
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        infinite: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              arrows: false,
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }, {
            breakpoint: 480,
            settings: {
              arrows: false,
              centerMode: false,
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      })
    }
  }
}
</script>

