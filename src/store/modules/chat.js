import * as types from '../mutation-types'
import api from '../utils/api'

const state = {
  user: null,
  currentRoomID: 0,
  emojis: Object,
  currentEmojiPage: 1,
  settings: Object,
  currentMessagePeriodPageUp: 1,
  currentMessagePeriodPageDown: 1,
  soundState: false
}

const getters = {
  // get current user
  getUser: state => state.user,
  // get current room
  getCurrentRoom: state => state.currentRoomID,
  // get emoji list
  getEmojiList: state => state.emojis,
  // get current emoji page
  getCurrentEmojiPage: state => state.currentEmojiPage,
  // get current chat settings
  getSettingsChat: state => state.settings,
  // get current period page
  getCurrentMessagePeriodPageUp: state => state.currentMessagePeriodPageUp,
  // get current period page
  getCurrentMessagePeriodPageDown: state => state.currentMessagePeriodPageDown,
  // get current sound state
  getCurrentSoundState: state => state.soundState
}

const mutations = {
  // Set user
  [types.SET_CURRENT_USER] (state, value) {
    state.user = value
  },
  // Set current room
  [types.SET_CURRENT_ROOM_ID] (state, value) {
    state.currentRoomID = value
  },
  // Set emoji list
  [types.SET_CURRENT_EMOJI] (state, value) {
    state.emojis = value
  },
  // Set current emoji page
  [types.SET_CURRENT_EMOJI_PAGE] (state, value) {
    state.currentEmojiPage = value
  },
  // Set current msg page
  [types.SET_CURRENT_MESSAGE_PERIOD_UP_PAGE] (state, value) {
    state.currentMessagePeriodPageUp = value
  },
  // Set current msg page
  [types.SET_CURRENT_MESSAGE_PERIOD_DOWN_PAGE] (state, value) {
    state.currentMessagePeriodPageDown = value
  },
  // Set current user chat settings
  [types.SET_CHAT_SETTINGS] (state, value) {
    state.settings = value
  },
  // Set current sound state
  [types.SET_CURRENT_SOUND_STATE] (state, value) {
    state.soundState = value
  }
}

const actions = {
  setCurrentUser: ({ commit, dispatch }, values) => {
    return api.get('user/profile', values).then(function (response) {
      commit(types.SET_CURRENT_USER, response.user)
    })
  },
  setCurrentEmoji: ({ commit, dispatch }, values) => {
    return api.get('emojis', values).then(function (response) {
      commit(types.SET_CURRENT_EMOJI, response)
    })
  },
  setCurrentRoomID: ({ commit, dispatch }, values) => {
    commit(types.SET_CURRENT_ROOM_ID, values.roomID)
  },
  setCurrentEmojiPage: ({ commit, dispatch }, values) => {
    commit(types.SET_CURRENT_EMOJI_PAGE, values.page)
  },
  setCurrentSoundState: ({ commit, dispatch }, values) => {
    commit(types.SET_CURRENT_SOUND_STATE, values.state)
  },
  setCurrentMessagePeriodPageUp: ({ commit, dispatch }, values) => {
    commit(types.SET_CURRENT_MESSAGE_PERIOD_UP_PAGE, values.page)
  },
  setCurrentMessagePeriodPageDown: ({ commit, dispatch }, values) => {
    commit(types.SET_CURRENT_MESSAGE_PERIOD_DOWN_PAGE, values.page)
  },
  setCurrentUserChatSettings: ({ commit, dispatch }, values) => {
    return api.get('chat/settings', values).then(function (response) {
      commit(types.SET_CHAT_SETTINGS, response)
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
