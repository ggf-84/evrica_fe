import {
  EventBus
} from './eventBus.js'

export default {
  methods: {
    onShowItemDetails: function (data) {
      // set loaders
      EventBus.$emit('showLoadingComments', true)
      EventBus.$emit('showLoadingGetItem', true)
      EventBus.$emit('showLoadingGetShares', true)
      // get comments of items
      this.sendGet('de/item/comments', '/' + data.hash)
      // get shares of item
      let jsonData = {page: 1, type: 'user'}
      var makeParams
      if (data.type === 'public') {
        makeParams = '/' + this.getCurrentItem.hash + '?page=' + jsonData.page
      } else {
        makeParams = '/' + this.getCurrentItem.hash + '/user' + '?page=' + jsonData.page
      }
      this.sendGet('de/share', makeParams)
      // set new data
      this.currentItem = data
      this.currentItemComments = []
      this.currentItemShares = []
    },
    onPostItemComment: function (data) {
      EventBus.$emit('showLoadingComments', true)
      this.sendPost('de/item/comment', null, {
        user: this.getUser,
        item: data.item,
        message: data.comment
      })
    },
    onLoadComments: function (data) {
      EventBus.$emit('showLoadingComments', true)
      let makeParams = '/' + data.item.hash + '?page=' + data.page
      this.sendGet('de/item/comments', makeParams)
    },
    onLoadShares: function (data) {
      if (parseInt(data.page) === 1) {
        this.currentItemShares = []
      }
      EventBus.$emit('showLoadingGetShares', true)
      var makeParams
      if (data.type === 'public') {
        makeParams = '/' + data.item.hash + '?page=' + data.page
      } else {
        makeParams = '/' + data.item.hash + '/user' + '?page=' + data.page
      }
      this.sendGet('de/share', makeParams)
    },
    onCreateItem: function (data) {
      if (data.ext === 'folder') {
        EventBus.$emit('showLoadingPostItem', true)
        let makeParams = '/' + this.getSelectedParent.hash + '/folder'
        let dataJson = {
          title: data.title
        }
        this.sendPost('data/exchange', makeParams, dataJson)
      } else {
        EventBus.$emit('showLoadingPostItem', true)
        let makeParams = '/' + this.getSelectedParent.hash + '/file/' + data.ext
        let dataJson = {
          title: data.title
        }
        this.sendPost('data/exchange', makeParams, dataJson)
      }
    },
    onLoadItems: function (data) {
      EventBus.$emit('showLoadingGetItem', true)
      if (typeof data.type !== 'undefined') {
        this.onSearchByLabel(data.label, data.page)
      } else {
        let makeParams = '/' + this.getSelectedParent.hash + '?page=' + data.page
        this.sendGet('de/parent', makeParams)
      }
    },
    onJoinFolder: function (data) {
      EventBus.$emit('showLoadingGetItem', true)
      EventBus.$emit('resetItemsPage', true)
      this.$store.dispatch('setParent', data)
      this.$store.dispatch('selectParent', data)
      let makeParams = '/' + data.hash
      this.sendGet('de/parent', makeParams)
      this.currentItems = []
    },
    onGetShares: function (data) {
      EventBus.$emit('showLoadingGetShares', true)
      var makeParams
      if (data.type === 'public') {
        makeParams = '/' + this.getCurrentItem.hash + '?page=' + data.page
      } else {
        makeParams = '/' + this.getCurrentItem.hash + '/user' + '?page=' + data.page
      }
      this.sendGet('de/share', makeParams)
    },
    onGetCacheItem: function (data) {
      let makeParams = '/' + data.data.hash
      this.sendGet('de/item', makeParams)
    },
    onDetachItemLabel: function (data) {
      let makeParams = '/' + data.id
      this.sendDelete('de/item/label', makeParams)
    },
    onAttachItemLabel: function (data) {
      if (data.type === 'selectedLabel') {
        let dataJson = {user: data.user, item: data.item, label: data.data}
        this.sendPost('de/item/label', null, dataJson)
      } else if (data.type === 'createdLabel') {
        let dataJson = {item: data.item, title: data.title, color: data.color}
        this.sendPost('de/label/item', null, dataJson)
      }
    },
    onMoveToTrash: function (data) {
      let makeParams = '/' + data.hash
      this.sendDelete('de/item', makeParams)
    },
    onRemoveTrash: function (data) {
      let makeParams = '/' + data.hash
      this.sendPost('de/item/restore', makeParams)
    },
    onSearchDE: function (data) {
      let makeParams = '/' + data.query
      this.sendGet('de/item/search', makeParams)
    },
    onJoinFileFolder: function (data) {
      var parent = data.parent
      EventBus.$emit('showLoadingGetItem', true)
      EventBus.$emit('resetItemsPage', true)
      this.$store.dispatch('setParent', parent)
      this.$store.dispatch('selectParent', parent)
      let makeParams = '/' + parent.hash
      this.sendGet('de/parent', makeParams)
      this.currentItems = []
    },
    onSearchByLabel: function (data, page = null) {
      EventBus.$emit('showLoadingGetItem', true)
      var makeParams = '/' + data.id
      if (page !== null) {
        makeParams += '?page=' + page
      }
      this.sendGet('de/items/label', makeParams)
    }
  }
}
