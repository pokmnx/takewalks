<template>
  <div class="footer-links">
    <ul>
      <li>
        <a href="https://help.takewalks.com" target="_blank">
          Help Center
        </a>
      </li>
      <li>
        <router-link to="/contact/">
          Contact Us
        </router-link>
      <li>
        <router-link to="/privacy-policy/">
          Privacy Policy
        </router-link>
      </li>
     
    </ul>
    <ul>
      <li>
        <router-link to="/cookies-policy/">
          Cookies Policy
        </router-link>
      </li>
      <li>
        <router-link to="/cancellation-policy/">
          Cancellation Policy
        </router-link>
      </li>
      <li>
        <router-link to="/terms/">
          Terms & Conditions
        </router-link>
      </li>
    </ul>
    <ul>
      <li>
        <router-link to="/careers/">
          Careers
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'FooterLink'
}
</script>

