<template>
  <input
    readonly
    :name="this.name"
    :type="this.type"
    :required="this.required"
    :placeholder="this.placeholder"
    :class="getClass()"
  >
</template>

<script>

import $ from 'jquery'
require('@/lib/jquery.plugin.js')
require('@/lib/jquery.datepick.js')

export default {
  name: 'DatePicker',
  mounted () {
    this.applyDatePicker('.foo-datepick')
  },
  props: {
    name: String,
    type: String,
    classes: String,
    placeholder: String,
    required: String
  },
  methods: {
    getClass () {
      return 'foo-datepick ' + this.classes
    },
    applyDatePicker (selector) {
      console.log(selector)
      var $sel = $(selector)
      $sel.datepick({
        changeMonth: false,
        prevText: '<svg version="1.1" viewBox="0 0 17.005 31.998" class="icon icon-arrow_left svg-icon svg-fill" style="width: 22px; height: 22px;"><path pid="0" _fill="#443D47" d="M16.743.248a.888.888 0 0 0-1.23 0L.263 15.388a.84.84 0 0 0 0 1.22l15.25 15.14c.17.17.39.25.62.25.22 0 .44-.08.61-.25.35-.34.35-.88 0-1.21l-14.63-14.54 14.63-14.54a.83.83 0 0 0 0-1.21z"></path></svg>',
        nextText: '<svg version="1.1" viewBox="0 0 17.005 31.998" class="icon icon-arrow_left svg-icon svg-fill" style="width: 22px; height: 22px;"><path pid="0" _fill="#443D47" d="M16.743.248a.888.888 0 0 0-1.23 0L.263 15.388a.84.84 0 0 0 0 1.22l15.25 15.14c.17.17.39.25.62.25.22 0 .44-.08.61-.25.35-.34.35-.88 0-1.21l-14.63-14.54 14.63-14.54a.83.83 0 0 0 0-1.21z"></path></svg>',
        showOtherMonths: true,
        selectOtherMonths: true,
        dayNamesMin: ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'],
        startDate: '0d',
        minDate: 0,
        useMouseWheel: false,
        onSelect: function () {
          $(this)
            .closest('.input-icon')
            .addClass('valid')
            .removeClass('invalid')
          $(this)
            .closest('.input-icon')
            .find('.icon-attention')
            .remove()
          $(this)
            .closest('.input-icon')
            .append('<svg version="1.1" viewBox="0 0 28.001 28" class="icon icon-checkmark_circled svg-icon svg-fill"><path pid="0" fill-rule="evenodd" _fill="#58B69E" d="M11.682 18.64c-.09-.12-.15-.22-.22-.29l-3.23-3.46c-.3-.33-.66-.39-.92-.15-.26.23-.25.59.04.9 1.27 1.36 2.54 2.72 3.82 4.08.38.39.69.38 1.06-.01l8.32-8.89c.37-.41.43-.74.16-.99-.28-.28-.61-.21-1 .2l-7.78 8.31c-.08.08-.14.16-.25.3zm-10.54-4.67c.1-7.19 5.76-12.77 12.82-12.8 7.06-.03 12.88 5.57 12.88 12.84 0 7.33-5.95 12.88-12.93 12.83-6.881-.05-12.71-5.54-12.77-12.87zM14.011 0C6.021.05-.109 6.52.001 14.2c.12 7.8 6.47 13.85 14.08 13.8 7.78-.05 13.96-6.36 13.92-14.03C27.961 6.1 21.631.03 14.011 0z"></path></svg>')
          $(this)
            .closest('.item')
            .removeClass('active')
            .addClass('completed')
          $('[data-section=\'selectTime\']').addClass('active')
        }
      })
    }
  }
}
</script>