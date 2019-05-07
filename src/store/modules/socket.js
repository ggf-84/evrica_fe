import * as types from '../mutation-types'

const state = {
  connected: false,
  authStatus: false,
  socketLocalURL: 'ws://127.0.0.1:8181',
  socketDevUrl: 'wss://dev.evrica.io:8085'
}

const getters = {
  // get current user
  getConnection: state => state.connected,
  // get auth status
  getAuthStatus: state => state.authStatus,
  // get local url
  getSocketLocalUrl: state => state.socketLocalURL,
  // get dev url
  getSocketDevUrl: state => state.socketDevUrl
}

const mutations = {
  // Set connection
  [types.SOCKET_CONNECT] (state, status) {
    state.connected = status
  },
  // Set message
  [types.SOCKET_AUTH_STATUS] (state, message) {
    state.authStatus = message
  }
}

const actions = {
  SOCKET_connected: ({ commit, dispatch }, value) => {
    commit(types.SOCKET_CONNECT, true)
  },
  SOCKET_auth: ({ commit, dispatch }, value) => {
    commit(types.SOCKET_AUTH_STATUS, value)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
