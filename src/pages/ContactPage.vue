<template>
  <main class="default contact-page container">
    <PageTitle title="Contact" />

    <div class="tabs centered city-nav-tabs">
      <a href="#customerservice" class="tab-item city-tour-tab">Customer Service</a>
      <a href="#problems" class="tab-item city-tour-tab">Problems While Travelling</a>
    </div>

    <div class="center-btn smaller">
      <p class="descr single center"><router-link to="/cancellation-policy/" class="green underlined">Change & Cancellation Policy</router-link></p><br>
    </div>

    <section class="grey" id="customerservice">
      <div class="container">
        <SubjectTitle
          title="Call Customer Service"
          iconName="call-customer-support"
          :small="true"
        />

        <p class="descr center">The best way to reach us for non-urgent matters us is by email: <a class="green phone-num" href="mailto:info@takewalks.com">info@takewalks.com</a></p>
        <p class="descr center separated">Our team will try to get back to you within 24 hours. Or you can speak to a member of our customer service team by calling the numbers below:</p>

        <p class="descr single center"><b>From the US (toll-free): <a href="tel:+18886838670" class="green phone-num"  style="white-space: nowrap">+1-888-683-8670</a></b></p>
        <p class="descr single center"><b>From the UK: <a href="tel:+448455916256" class="green phone-num">+44-845-591-6256</a></b></p>
        <p class="descr single center"><b>International: <a href="tel:+12026846916" class="green phone-num">+1-202-684-6916</a></b></p>
      </div>
    </section>

    <section id="problems">
      <SubjectTitle
        title="Problems While Travelling"
        iconName="problems-while-traveling"
        :small="true"
      />
      <p class="descr center separated">
        If you have a problem with your tour or finding a location, you can get in touch with our local teams (office hours are in local time):
      </p>
      <div class="guides-wrap g-separated-top">
        <CountryBox
          v-bind="contact"
          v-for="contact in contacts"
          v-bind:key="contact.name"
        />
      </div>
      <div class="guides-wrap g-separated-top">
        <CountryBox
          v-bind="contact"
          v-for="contact in contacts2"
          v-bind:key="contact.name"
        />
      </div>
    </section>
  </main>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import $ from 'jquery'
import PageTitle from '@/components/PageTitle'
import SubjectTitle from '@/components/SubjectTitle'
import CountryBox from '@/components/CountryBox'

export default {
  name: 'ContactPage',
  components: {
    PageTitle,
    SubjectTitle,
    CountryBox
  },
  computed: {
    ...mapGetters([
      'isLogged'
    ])
  },
  mounted () {
    $('#launcher').removeClass('launcher-detail')
    var self = this
    var hideActiveSidebar = function () {
      var $sidebar = $('.sidebar.active')
      $sidebar.removeClass('active').hide()
    }

    $('.top-nav-register').click(function () {
      hideActiveSidebar()
      $('.login-sidebar-buttons .error-message').hide()
      $('.sidebar.login-sidebar-register')
        .show()
        .addClass('active')
      $('.login-sidebar-register .btn-toggler[data-toggle-toggler=booked]').trigger('click')
    })

    $('.top-nav-login, .contact-log-in').click(function () {
      hideActiveSidebar()
      if (self.isLogged !== true) {
        $('.login-sidebar-buttons .error-message').hide()
        $('.sidebar.login-sidebar-login')
          .show()
          .addClass('active')
        if ($(this).hasClass('open-register')) {
          $('.sidebar.login-sidebar-login #btnSignUp').trigger('click')
        }
      }
    })
    this.scrollToSpy()
    $('html, body').animate({scrollTop: 0}, 400)
    document.dispatchEvent(new Event('render-event'))
  },
  data () {
    return {
      contacts: [
        {
          name: 'USA',
          description: '<p class="descr"><a href="tel:+18886838670" class="green phone-num">+1-888-683-8670</a> (toll-free)</p>',
          avatar: '../static/img/places/statue.jpg'
        },
        {
          name: 'Italy',
          description: '<p class="descr"><a href="tel:+390694804888" class="green phone-num">+39-069-480-4888</a></p>',
          avatar: '../static/img/places/italy.jpg'
        },
        {
          name: 'France',
          description: '<p class="descr"><a href="tel:+33176360101" class="green phone-num">+33-176-36-0101</a></p>',
          avatar: '../static/img/places/france.jpg'
        }
      ],
      contacts2: [
        {
          name: 'Spain',
          description: '<p class="descr"><a href="tel:+34911232780" class="green phone-num">+34-911-232-780</a></p>',
          avatar: '../static/img/places/Spain.png'
        },
        {
          name: 'United Kingdom',
          description: '<p class="descr"><a href="tel:+448455916256" class="green phone-num">+44-845-591-6256</a></p>',
          avatar: '../static/img/places/London.png'
        },
        {
          name: 'International',
          description: '<p class="descr"><a href="tel:+12026846916" class="green phone-num">+1-202-684-6916</a></p>',
          avatar: '../static/img/places/International.png'
        }
      ]
    }
  },
  methods: {
    scrollToSpy () {
      let lastId
      let topMenu = $('.city-tour-tabs, .city-nav-tabs:not(.my-account-tabs)')
      let topMenuHeight = topMenu.outerHeight() + 15
      // All list items
      let menuItems = topMenu.find('a')
      // Anchors corresponding to menu items
      let scrollItems = menuItems.map(function () {
        let item = $($(this).attr('href'))
        if (item.length) {
          return item
        }
      })
      // Bind to scroll
      $(window).scroll(function () {
        // Get container scroll position
        let fromTop = $(this).scrollTop() + topMenuHeight
        // Get id of current scroll item
        let cur = scrollItems.map(function () {
          if ($(this).offset().top < fromTop) return this
        })
        // Get the id of the current element
        cur = cur[cur.length - 1]
        let id = cur && cur.length ? cur[0].id : ''

        if (lastId !== id) {
          lastId = id
          // Set/remove active class
          menuItems
            .removeClass('active')
            .filter('[href=\'#' + id + '\']')
            .addClass('active')
        }
      })
    },
    getMetaURL () {
      let trailingSlash = ''
      if (!this.$route.path.match(/\/$/)) {
        trailingSlash = '/'
      }
      return Vue.url.options.root + this.$route.path + trailingSlash
    }
  },
  metaInfo () {
    return {
      title: 'Contact Us',
      meta: [
        {
          'property': 'og:title',
          'content': 'Contact Us'
        },
        {
          'property': 'og:description',
          'content': 'Contact Us'
        },
        {
          'property': 'og:type',
          'content': 'article'
        },
        {
          'property': 'og:url',
          'content': this.getMetaURL()
        },
        {
          'property': 'fb:app_id',
          'content': 1989124628036695
        },
        {
          vmid: 'description',
          name: 'description',
          content: 'Contact Us'
        }
      ],
      link: [
        { 'rel': 'canonical',
          'href': this.getMetaURL()
        }
      ]
    }
  }
}
</script>

