<template >
  <div class="right-sidebar-item options-picker-container" data-section="optionsPicker">
    <div class="sidebar-subheading sidebar-subheading-booking">
      <div class="sidebar-circle sidebar-circle-options">5</div>
      <p class="select-options">Upgrades</p>
    </div>
    <div class="sidebar-content select-fullwidth sidebar-selected-value">
        <p>Price per guest</p>
        <div class="checkbox-center checkbox-center-booking-widget">
        </div>
    </div>
    <div class="sidebar-heading payment-sidebar-heading booking-sidebar-heading" style="width:100%" v-if="displayOptionsPrice">
      <h2 class="heading payment-heading">Total</h2>
      <span class="price total-price">{{ totalPrice }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OptionForm',
  props: ['totalPrice', 'displayOptionsPrice']
}
</script>

