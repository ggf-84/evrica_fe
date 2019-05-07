import * as types from '../mutation-types'
import api from '../utils/api'

const state = {
  status: false,
  data: {},
  permission: false
}

const getters = {
  // get worker data
  getWorkerData: state => state.data,
  // get worker status
  getWorkerStatus: state => state.status,
  // get worker permission
  getWorkerPermission: state => state.permission
}

const mutations = {
  // set worker data
  [types.WORKER_DATA] (state, status) {
    state.data = status
  },
  // set worker status
  [types.WORKER_STATUS] (state, message) {
    state.status = message
  },
  // set worker permission
  [types.WORKER_PERMISSION] (state, message) {
    state.permission = message
  }
}

const actions = {
  setWorkerData: ({ commit, dispatch }, value) => {
    commit(types.WORKER_DATA, value)
  },
  setWorkerStatus: ({ commit, dispatch }, value) => {
    commit(types.WORKER_STATUS, value)
  },
  setWorkerPermission: ({ commit, dispatch }, value) => {
    commit(types.WORKER_PERMISSION, value)
  },
  checkPushSubscription: ({ commit, dispatch }, values) => {
    return api.get('push/subscription', values).then(function (response) {
      commit(types.WORKER_PERMISSION, response.status)
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
