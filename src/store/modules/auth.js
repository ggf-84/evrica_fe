import * as types from '../mutation-types'
import api from '../utils/api'
import Vue from 'vue'

const state = {
  token: null,
  error: {
    message: '',
    code: 0,
    app_code: 0
  },
  is_error: false,
  authorized: false
}

const getters = {
  // get token
  getToken: state => state.token,
  // get Authorization header
  getAuthHeader: state => {
    return { header: 'Authorization', value: 'Bearer ' + state.token }
  },
  // get error from failed
  auth_error: state => state.error,
  // boolean check if auth has error
  is_error: state => state.is_error,
  // boolean get status of user
  authorized: (state, getters) => state.authorized
}

const mutations = {
  // Set token
  [types.SET_ACCESS_TOKEN] (state, value) {
    //  save token
    state.token = value
    // is current client authorized?
    state.authorized = true
    // is current request wrong?
    state.is_error = false
    // set header for requests
    if (state.authorized) {
      Vue.http.headers.common['Authorization'] = 'Bearer ' + state.token
    }
  },
  // Save errors from auth
  [types.SET_AUTH_ERROR] (state, value) {
    if (value.body) {
         // save error
      state.error = {
        message: value.body.message ? value.body.message : '',
        code: value.status,
        app_code: value.body.app_code ? value.body.app_code : 0
      }
    }
    //  token is set
    state.authorized = false
    // set general status of auth proccess
    state.is_error = true
  },
  // Clear access token and change status
  [types.CLEAR_ACCESS_TOKEN] (state) {
    // set token default value
    state.token = null
    // set default value to status of auth
    state.is_error = false
    // set default value to error list
    state.error = {
      message: '',
      code: 0,
      app_code: 0
    }
    // set default value to system status
    state.authorized = false
  }
}

const actions = {
  auth: ({ commit, dispatch }, values) => {
    return api.post('auth', values).then(function (response) {
      commit(types.SET_ACCESS_TOKEN, response.token)
    }).catch(function (error) {
      commit(types.SET_AUTH_ERROR, error)
    })
  },
  clearToken: ({ commit }) => {
    commit(types.CLEAR_ACCESS_TOKEN)
  },
  logout: ({ commit }) => {
    commit(types.CLEAR_ACCESS_TOKEN)
  },
  addAuthError: ({commit}, error) => {
    commit(types.SET_AUTH_ERROR, error)
  },
  // Fire after success auth
  afterSuccessAuth: ({ commit, dispatch }) => {
    // Get settings list
    dispatch('getSettings', null, {root: true})
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
