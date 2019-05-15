<template>
  <div class="section-cta">
    <p class="descr">Can&#39;t decide which tour is best for you? See below for more details & to search availability by date.</p>
    <router-link :to="this.slug" class="btn primary green">
      Compare Tours
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'CompareTours',
  props: {
    slug: {
      type: String,
      required: true
    }
  }
}
</script>

