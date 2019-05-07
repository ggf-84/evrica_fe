import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import auth from './modules/auth'
import settings from './modules/settings'
import dynamicUI from './modules/dynamicUI'
import chat from './modules/chat'
import socket from './modules/socket'
import worker from './modules/worker'
import dataexchange from './modules/dataexchange'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    auth,
    settings,
    dynamicUI,
    chat,
    socket,
    worker,
    dataexchange
  },
  strict: false,
  plugins: [createPersistedState({secure: true})]
})
