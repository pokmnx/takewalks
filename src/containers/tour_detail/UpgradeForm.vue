<template >
  <div class="right-sidebar-item upgrades-picker-container" data-section="upgradesPicker">
    <div class="sidebar-subheading sidebar-subheading-booking">
      <div class="sidebar-circle sidebar-circle-upgrades">4</div>
      <p class="select-upgrades">Please select an option</p>
    </div>
    <div class="sidebar-content select-fullwidth sidebar-selected-value">
      <select name="upgrades" class="single-select upgrades-select" data-placeholder="Select an upgrade"></select>
    </div>
    <div class="sidebar-heading payment-sidebar-heading booking-sidebar-heading" style="width:100%" v-if="displayUpgradesPrice">
      <h2 class="heading payment-heading">Total</h2>
      <span class="price total-price">{{ totalPrice }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpgradeForm',
  props: ['totalPrice', 'displayUpgradesPrice']
}
</script>

