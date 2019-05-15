<template>
  <div>
    <div v-if="this.status.type==='error'" class="flashMessage small">
      <i class="fa fa-exclamation-circle"></i>
      <span class="message">{{ this.status.message }}</span>
      <a @click="dismissMessage" title="Dismiss message" class="dismiss">x</a>
    </div>
    <div v-if="this.status.type==='lightbox'" class="wrapNotes expanded">
      <section class="add_to_cart">
        <a class="close">&#x2715;</a>
        <p>{{ this.status.message }}</p>
        <div class="links">
          <a href="<?php echo FULL_BASE_URL ?>" class="grey button small">Continue shopping</a>
        </div>
      </section>
    </div>
    <div v-if="this.status.type==='status'" class="flashMessage small success">
      <span class="message">{{ this.status.message }}</span>
      <a @click="dismissMessage" title="Dismiss message" class="dismiss">x</a>
    </div>
  </div>
</template>

<script>

import $ from 'jquery'
import { mapGetters } from 'vuex'

export default {
  name: 'FlashMessage',
  computed: {
    ...mapGetters([
      'status'
    ])
  },
  methods: {
    dismissMessage () {
      var self = this
      $('.flashMessage').slideUp(function () {
        self.$store.commit('setStatus', 'none')
        $('.flashMessage').removeAttr('style')
      })
    }
  }
}
</script>

<style>
.wrapNotes .add_to_cart{
    position: relative;
    padding: 20px 20px 0 20px;
    text-align: center;
    margin-bottom: 10px;

    background: #E3E3E3;
    border-bottom: 2px solid #CECECE;
    box-sizing: border-box;
}
.wrapNotes .add_to_cart .close {
    background: #CECECE;
    padding: 5px;
    border-radius: 25px;
    position: absolute;
    top: 7px;
    right: 7px;
    width: 12px;
    height: 12px;
    text-align: center;
    cursor: pointer;
}
.wrapNotes .add_to_cart .close:hover{
    background: #bdbdbd;
}
.wrapNotes .add_to_cart p {
    margin: 0;
    padding: 0;
    color: #77786A;
    font-size: 1.563em;

}
.add_to_cart .button {
    display: inline-block;
    vertical-align: middle;
    margin: 1rem 2rem;
    background: #A08F56;
    color: #FFF;
    padding: 5px 10px;
    font-size: .75rem;
    text-decoration: none;
}
</style>


