<template>
  <div class="right-sidebar-item pax-picker-container" data-section="paxPicker">
    <div class="sidebar-subheading sidebar-subheading-booking">
      <div class="sidebar-circle sidebar-circle-guest">3</div>
      <p class="select-pax">Number of guests</p>
    </div>
    <div class="sidebar-content">
      <div class="guest-select-row adults-container">
        <div class="select-item">
          <select name="adults" class="single-select single-select-adult">
            <option
              v-for="index in 12"
              v-bind:key="index"
              :value="index"
            >
              {{ index - 1 }}
            </option>
          </select>
        </div>
        <div class="guest-label">
          <span>Adults</span>
        </div>
        <div class="guest-price">$95.00</div>
      </div>
      <div class="guest-select-row infants-container">
        <div class="select-item">
          <select name="infants" id="" class="single-select">
            <option
              v-for="index in 12"
              v-bind:key="index"
              :value="index"
            >
              {{ index - 1 }}
            </option>
          </select>
        </div>
        <div class="guest-label">
          <span>Infants</span>
          <em>(Under 2)</em>
        </div>
        <div class="guest-price">Free</div>
      </div>
      <div class="guest-select-row children-container">
        <div class="select-item">
          <select name="children" class="single-select">
            <option
              v-for="index in 12"
              v-bind:key="index"
              :value="index"
            >
              {{ index - 1 }}
            </option>
          </select>
        </div>
        <div class="guest-label">
          <span>Children</span>
          <em>(Age: 2 - 14)</em>
        </div>
        <div class="guest-price">$75.00</div>
      </div>
      <div class="guest-select-row students-container">
        <div class="select-item">
          <select name="students" class="single-select">
            <option
              v-for="index in 12"
              v-bind:key="index"
              :value="index"
            >
              {{ index - 1 }}
            </option>
          </select>
        </div>
        <div class="guest-label">
          <span>Students</span>
        </div>
        <div class="guest-price">$85.00</div>
      </div>
      <!-- <h2 class="small default total" style="display: none"><span class="guest-amount"></span> Guests for <span class="total-price"></span></h2> -->
    </div>
    <div class="sidebar-heading payment-sidebar-heading booking-sidebar-heading" style="width:100%" v-if="displaySingleEventPrice">
      <h2 class="heading payment-heading">Total</h2>
      <span class="price total-price">{{ totalPrice }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuestsForm',
  props: ['totalPrice', 'displaySingleEventPrice']
}
</script>

