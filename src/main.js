// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueProgressBar from 'vue-progressbar'
import * as svgicon from 'vue-svgicon'
import App from './App'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'

Vue.config.productionTip = false
Vue.url.options.root = process.env.APP_BASE_URL

const options = {
  color: '#57B69D',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}
Vue.use(VueProgressBar, options)

Vue.use(svgicon, {
  tagName: 'svgicon'
})
Vue.use(require('vue-moment'))

window.$ = window.jQuery = require('jquery')
window._ = require('./lib/jquery.plugin.js')
window._ = require('./lib/jquery.datepick.js')
window._ = require('./lib/select2.full.min.js')
window._ = require('./lib/slidebars.min.js')

/* eslint-disable no-new */

sync(store, router)

export default new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
