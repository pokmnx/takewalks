<template>
  <div class="input-row auto foo-validate">
    <div :class="getClass()">
      <input ref="input" :type="type" :name="name" :value="value" :required="required" :minlength="minlength" @input="updateValue($event.target.value)">
      <div class="placeholder">{{ placeholder }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'InputField',
  props: {
    type: String,
    name: String,
    value: String,
    placeholder: String,
    required: String,
    minlength: String
  },
  methods: {
    getClass () {
      console.log(this.value)
      if (this.value !== undefined && this.value !== '') {
        return 'input-div input-icon md-placeholder valid'
      } else {
        return 'input-div input-icon md-placeholder'
      }
    },
    updateValue (value) {
      this.$emit('input', value)
    }
  }
}
</script>
