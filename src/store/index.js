import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import vuexCache from 'vuex-cache'

import Home from './modules/Home'
import TourList from './modules/TourList'
import User from './modules/User'
import Common from './modules/Common'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    Home: Home,
    TourList: TourList,
    User: User,
    Common: Common
  },
  plugins: [createPersistedState({
    key: 'takewalks_state',
    paths: ['Common.currency', 'TourList.cartComplete']
  }), vuexCache]
})

export default store
