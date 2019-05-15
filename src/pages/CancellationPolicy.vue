<template>
  <main class="default">
    <PageTitle title="Cancellation Policy" />
    <section class="grey">
      <div class="container">
        <div>
          <p class="descr">In order to provide the highest level of service with top guides and guaranteed tour
              departures, cancellations and amendments may be subject to fees. The policy applies to all group and
              private tours listed and booked through takewalks.com or Walks LLC, on a per person and per tour
              basis.
          </p>

          <br>
          <br>
          <p class="descr"><b>GROUP TOURS & ACTIVITIES</b></p>
          <ul>
            <li><p class="descr">Cancellations received greater than 72 hours prior to tour commencement are
                    fully refundable.</p></li>
            <li><p class="descr">Cancellations received within 72 hours of tour commencement are
                    nonrefundable.</p></li>
            <li><p class="descr">Amendment requests are subject to availability and price changes.</p></li>
          </ul>

          <p class="descr"><b>PRIVATE TOURS & ACTIVITIES</b></p>
          <ul>
            <li><p class="descr">Cancellations received greater than 7 days prior to tour commencement are fully
                    refundable.</p></li>
            <li><p class="descr">Cancellations received within 7 days of tour commencement are
                    nonrefundable.</p></li>
            <li><p class="descr">All amendments made to private tours may be subject to an administrative fee up
                    to 20%.</p></li>
          </ul>

          <p class="descr"><b>LATE ARRIVALS & NO SHOWS</b></p>
          <ul>
            <li><p class="descr">Late arrivals and no shows are nonrefundable. This is applicable to any tour
                    participant that fails to arrive, or arrives after tour departure.</p></li>
          </ul>

          <p class="descr"><b>CHANGES TO THIS POLICY</b></p>
          <p class="descr single">From time to time, the terms of this policy may change at the Company's
              discretion. In the event of such changes, the new policy will apply for all tours booked after the
              date and time of the policy change. For any further questions about our cancellation policy, please
              feel free to e-mail us at <a href="mailto:info@takewalks.com">info@takewalks.com</a></p>
          <p class="descr single">There is a good chance we’ve answered your question on the FAQ section on each
              of our tour pages, but if not, the best way to contact us for non-urgent matters us is by email at
              <a href="mailto:info@takewalks.com">info@takewalks.com</a>. Our team will get back to you within 24
              hours with a full response.</p>

          <ContactSection />
        </div>
      </div>
    </section>
  </main>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import PageTitle from '@/components/PageTitle'
import ContactSection from '@/components/ContactSection'

export default {
  name: 'CancellationPolicy',
  components: {
    PageTitle,
    ContactSection
  },
  mounted () {
    $('#launcher').removeClass('launcher-detail')
    $('html, body').animate({scrollTop: 0}, 400)
    document.dispatchEvent(new Event('render-event'))
  },
  metaInfo () {
    return {
      title: 'Cancellation Policy',
      meta: [
        {
          'property': 'og:title',
          'content': 'Cancellation Policy'
        },
        {
          'property': 'og:description',
          'content': 'Cancellation Policy'
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
          content: 'Cancellation Policy'
        }
      ],
      link: [
        { 'rel': 'canonical',
          'href': this.getMetaURL()
        }
      ]
    }
  },
  methods: {
    getMetaURL () {
      let trailingSlash = ''
      if (!this.$route.path.match(/\/$/)) {
        trailingSlash = '/'
      }
      return Vue.url.options.root + this.$route.path + trailingSlash
    }
  }
}
</script>

