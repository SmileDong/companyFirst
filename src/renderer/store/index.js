import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import state from './state'
import mutations from './mutations'
// import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  state,
  mutations,
  strict: process.env.NODE_ENV !== 'production'
})
