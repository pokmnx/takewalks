<template>
  <div class="reviews modal-overlay">
    <div class="modal" data-modal-target="reviews">
      <div class="modal-content">
        <svgicon name="close" class="icon icon-close" width="28" height="28" data-modal-close/>
        <h2 class="modal-title">Reviews</h2>
        <div class="reviews-container tour-box-reviews"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReviewModal'
}
</script>
