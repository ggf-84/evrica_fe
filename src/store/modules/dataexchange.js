import * as types from '../mutation-types'

const state = {
  currentItem: {},
  currentParents: [],
  selectedParent: {},
  sharingPermissions: {},
  sharedItemData: {},
  currentShareItems: [],
  currentShareItem: {},
  rootParent: {}
}

const getters = {
  // get current item
  getCurrentItem: state => state.currentItem,
  // get current parents
  getCurrentParents: state => state.currentParents,
  // get selected parent
  getSelectedParent: state => state.selectedParent,
  // get sharing permissions
  getSharingPermissions: state => state.sharingPermissions,
  // get sharing item data
  getSharedItemData: state => state.sharedItemData,
  // get current share items
  getCurrentShareItems: state => state.currentShareItems,
  // get current share item
  getCurrentShareItem: state => state.currentShareItem,
  // get current root item
  getSelectedRootParent: state => state.rootParent
}

const mutations = {
  // Set item
  [types.SET_CURRENT_ITEM] (state, value) {
    state.currentItem = value
  },
  // Set parent
  [types.SET_PARENT] (state, value) {
    state.currentParents = state.currentParents.concat(value)
  },
  // Reset parents
  [types.RESET_PARENTS] (state, value) {
    state.currentParents = value
  },
  // Clear parent
  [types.CLEAR_PARENTS] (state, value) {
    state.currentParents = []
  },
  // selected parent
  [types.SELECTED_PARENT] (state, value) {
    state.selectedParent = value
  },
  // Set parent
  [types.SELECTED_ROOT_PARENT] (state, value) {
    state.rootParent = value
  },
  // set sharing permissions
  [types.SET_SHARING_PERMISSIONS] (state, value) {
    state.sharingPermissions = value
  },
  // set shared item data
  [types.SET_SHARED_ITEM_DATA] (state, value) {
    state.sharedItemData = value
  },
  // update current item size
  [types.UPDATE_CURRENT_ITEM_SIZE] (state, value) {
    let currentSize = state.currentItem.size
    let setSize = parseInt(currentSize) + parseInt(value.size)
    state.currentItem.size = setSize
  },
  // update current item shared
  [types.UPDATE_CURRENT_ITEM_SHARED] (state, value) {
    state.currentItem.is_shared = value.shared
  },
  // set current item password
  [types.SET_ITEM_PASSWORD] (state, value) {
    // check if array has item with token
    var items = state.currentShareItems.find(item => item.item === value.item)
    // check items
    if (items) {
      state.currentShareItems.map(function (elem) {
        if (items.item === elem.item) {
          let index = state.currentShareItems.indexOf(elem)
          if (index > -1) {
            state.currentShareItems.splice(index, 1)
          }
        }
      })
    }
    state.currentShareItems = state.currentShareItems.concat(value)
  },
  // clear item password
  [types.CLEAR_ITEM_PASSWORD] (state, value) {
    state.currentShareItems = []
  },
  // clear share item
  [types.SET_CURRENT_SHARE_ITEM] (state, value) {
    state.currentShareItem = value
  }
}

const actions = {
  setCurrentItem: ({ commit, dispatch }, value) => {
    commit(types.SET_CURRENT_ITEM, value)
  },
  updateCurrentItemSize: ({ commit, dispatch }, value) => {
    commit(types.UPDATE_CURRENT_ITEM_SIZE, value)
  },
  updateCurrentItemShared: ({ commit, dispatch }, value) => {
    commit(types.UPDATE_CURRENT_ITEM_SHARED, value)
  },
  setCurrentShareItems: ({ commit, dispatch }, value) => {
    commit(types.SET_ITEM_PASSWORD, value)
  },
  clearItemPassword: ({ commit, dispatch }, value) => {
    commit(types.CLEAR_ITEM_PASSWORD, value)
  },
  setCurrentShareItem: ({ commit, dispatch }, value) => {
    commit(types.SET_CURRENT_SHARE_ITEM, value)
  },
  setSharedItemData: ({ commit, dispatch }, value) => {
    commit(types.SET_SHARED_ITEM_DATA, value)
  },
  setParent: ({ commit, dispatch }, value) => {
    commit(types.SET_PARENT, value)
  },
  setSharingPermissions: ({ commit, dispatch }, value) => {
    commit(types.SET_SHARING_PERMISSIONS, value)
  },
  resetParents: ({ commit, dispatch }, value) => {
    commit(types.RESET_PARENTS, value)
  },
  selectParent: ({ commit, dispatch }, value) => {
    commit(types.SELECTED_PARENT, value)
  },
  selectRootParent: ({ commit, dispatch }, value) => {
    commit(types.SELECTED_ROOT_PARENT, value)
  },
  clearParents: ({ commit, dispatch }, value) => {
    commit(types.CLEAR_PARENTS, value)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
