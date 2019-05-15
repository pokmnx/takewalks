<template>
  <section class="contact-section">
    <div class="container">
      <SubjectTitle
        title="Sign Up With Us"
        :description="signUpDescription"
        iconName="sign_up"
      />
      <SignupBox />
    </div>
  </section>
</template>

<script>

import { mapGetters } from 'vuex'

import SubjectTitle from '@/components/SubjectTitle'
import SignupBox from '@/components/SignupBox'

export default {
  name: 'SignupForm',
  components: {
    SubjectTitle,
    SignupBox
  },
  computed: {
    ...mapGetters([
      'signUpDescription'
    ])
  }
}
</script>

