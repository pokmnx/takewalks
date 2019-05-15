<template>
  <div class="topnav-cart">
    <svgicon name="cart_full" width="24" height ="24" class="icon icon-cart_full"></svgicon>
    <span class="item-count">{{ amount }}</span>
  </div>
</template>

<script>
export default {
  name: 'HeaderCartButton',
  props: {
    amount: Number
  }
}
</script>
