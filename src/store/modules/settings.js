import * as types from '../mutation-types'
import api from '../utils/api'
import Vue from 'vue'

const state = {
  allSettings: null,
  metadataSettings: null,
  languages: null,
  language: null
}

const getters = {
  allSettings: state => state.allSettings,
  // return metadata for settings
  metadataSettings: state => state.metadataSettings,
  getLanguage: state => state.language,
  getAvailableLanguages: state => state.languages
}
// Store all settings for current user
const mutations = {
  // Get setting values from backend
  [types.GET_ALL_SETTINGS] (state, value) {
    state.allSettings = value
  },
  // Get metadata for settings
  [types.GET_METADATA_SETTINGS] (state, value) {
    state.metadataSettings = value
  },
  // Update settings
  [types.UPDATE_ALL_SETTINGS] (state, value) {
    state.allSettings = value
  },
  [types.GET_LANGUAGES_LIST] (state, value) {
    state.languages = value
  },
  [types.SET_CURRENT_LANGUAGE] (state, value) {
    if (value.language) {
      // try to find language by id from list of all available languages
      if (state.languages) {
        var language = state.languages.filter((lang) => {
          return parseInt(lang.id) === parseInt(value.language)
        })
        if (language[0]) {
          state.language = language[0]
        }
      }
    } else {
      state.language = 0
    }
    if (state.language.code) {
      let languageCode = state.language.code + `;q=0.9;`
      Vue.http.headers.common['Accept-Language'] = languageCode
    }
  }
}
// Get settings from API
const actions = {
  getSettings: ({ commit }, values) => {
    return api.get('company/settings').then(function (response) {
      commit(types.GET_ALL_SETTINGS, response)
    })
  },
  getSettingsMetaData: ({commit}, value) => {
    return api.get('metadata/Settings').then(function (response) {
      commit(types.GET_METADATA_SETTINGS, response)
    })
  },
  updateSettings: ({commit}, values) => {
    return api.post('company/settings', values).then(function (response) {
      commit(types.UPDATE_ALL_SETTINGS, values)
    })
  },
  getCurrentLanguage: ({commit}, values) => {
    return api.get('user/settings/language').then(function (response) {
      commit(types.SET_CURRENT_LANGUAGE, response)
    })
  },
  setCurrentLanguage: ({commit}, values) => {
    return api.post('user/settings', values).then(function (response) {
      commit(types.SET_CURRENT_LANGUAGE, values)
    })
  },
  getLanguagesList: ({commit}, values) => {
    return api.get('language').then(function (response) {
      commit(types.GET_LANGUAGES_LIST, response)
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
