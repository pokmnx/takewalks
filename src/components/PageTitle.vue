<template>
  <div class="container">
    <h1 class="page-title">{{ this.title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    title: String
  }
}
</script>

