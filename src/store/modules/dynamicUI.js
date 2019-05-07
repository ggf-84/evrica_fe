import * as types from '../mutation-types'
import api from '../utils/api'

const state = {
  window: null,
  schema: null,
  metadata: {},
  data: {},
  dynamicUIErorrs: []
}

const getters = {
  // get current window
  getWindow: state => state.window,
  // get window json schema
  getSchema: state => state.schema,
  // get metadata
  getMetaData: state => state.metadata,
  // get metadata for entity
  getMetaDataEntity: (state) => (entity) => {
    // console.log('ent: ' + entity)
    if (typeof entity !== 'undefined') {
      if (state.metadata) {
        return state.metadata[entity]
      }
    }

    return {}
  },
  // get errors
  getMetaDataErrors: state => state.dynamicUIErorrs,
  // get records for current entity
  getDynamicUIData: state => state.data,
  // get current window
  getCurrentWindow: state => state.window
}

const mutations = {
  // Set token
  [types.SET_CURRENT_WINDOW] (state, value) {
    state.window = value
  },
  [types.SET_WINDOW_SCHEMA] (state, value) {
    if (value.metadata) {
      state.schema = JSON.parse(value.metadata)
    }
  },
  [types.SET_DYNAMIC_ERROR] (state, value) {
    state.dynamicUIErorrs.push(value)
  },
  [types.SET_META_DATA] (state, value) {
    state.metadata[value.entity] = value.data[value.entity]
  },

  [types.GET_ENTITY_DATA] (state, value) {
    state.data[value.entity] = value.data
  }
}

const actions = {
  setCurrentWindow: ({ commit, dispatch }, value) => {
    commit(types.SET_CURRENT_WINDOW, value)
    dispatch('getWindowSchema', value, { root: true })
  },
  getWindowSchema: ({ commit, dispatch }, value) => {
    return api.get('window/' + value + '/' + window.innerWidth).then(function (response) {
      commit(types.SET_WINDOW_SCHEMA, response)
    }, error => {
      commit(types.SET_DYNAMIC_ERROR, error)
    })
  },
  getWindowMetaData: ({ commit, dispatch }, value) => {
    return api.get('metadata/' + value).then(response => {
      commit(types.SET_META_DATA, { data: response, entity: value })
    })
  },
  getWindowData: ({ commit, dispatch }, value) => {
    // check params
    if (!value.path || !value.entity) return null
    // if all ok, make request
    return api.get(value.path).then(response => {
      commit(types.GET_ENTITY_DATA, { data: response, entity: value.entity })
      // get metadata for current entity
      dispatch('getWindowMetaData', value.entity)
    }, error => {
      commit(types.SET_DYNAMIC_ERROR, error)
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
