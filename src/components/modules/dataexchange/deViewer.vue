<template>
<div class="de-container">

  <!-- row start -->
  <el-row :gutter="20">

    <!-- column start -->
    <el-col :span="16">
      <!-- items path -->
      <div class="items-path">
        <itemsPath @createItem="onCreateItem($event)" @joinFolder="onJoinFolder($event)" :parent="currentParent" @getCacheItem="onGetCacheItem($event)"></itemsPath>
      </div>
      <!-- end items path -->

      <!-- list items -->
      <div class="de-items-container">
        <deItems :items="currentItems" @removeFromTrash="onRemoveTrash($event)" @moveToTrash="onMoveToTrash($event)" @attachItemLabel="onAttachItemLabel($event)" @detachItemLabel="onDetachItemLabel($event)" @showItemDetails="onShowItemDetails($event)" @loadItems="onLoadItems($event)" @joinFolder="onJoinFolder($event)"></deItems>

        <!-- loader -->
        <div>
          <loader :loading="dataIsLoading" class="loader-items"></loader>
        </div>
        <!-- end loader -->
      </div>
      <!-- list item end -->


      <div class="search-container">
        <!-- display search results -->
        <deSearch :items="searchItems" @showItemDetails="onShowItemDetails($event)" @joinFolder="onJoinFolder($event)" @joinFileFolder="onJoinFileFolder($event)"></deSearch>
      </div>

    </el-col>
    <!-- column end -->

    <!-- column start -->
    <el-col :span="8">
      <!-- item details -->
      <div>
        <deItem :item="currentItem" :comments="currentItemComments" :shares="currentItemShares" @getShares="onGetShares($event)" @postItemComment="onPostItemComment($event)" @loadComments="onLoadComments($event)" @loadShares="onLoadShares($event)" @getCacheItem="onGetCacheItem($event)"></deItem>
      </div>
      <!-- item details end  -->
    </el-col>
    <!-- column end  -->

  </el-row>
  <!-- row end  -->

</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import deViewer from '../../modules/dataexchange/deViewer.vue'
import deItems from '../../modules/dataexchange/items.vue'
import deItem from '../../modules/dataexchange/item.vue'
import itemsPath from '../../modules/dataexchange/itemsPath.vue'
import deSearch from './searchDE.vue'
import backendMixin from '../../../mixins/modules/dataexchange/backend.js'
import onEventsMixin from '../../../mixins/modules/dataexchange/deOnEvents.js'
import dataMixin from '../../../mixins/modules/dataexchange/dataModifier.js'
import {
  EventBus
} from '../../../mixins/modules/dataexchange/eventBus.js'
import loader from '../../modules/dataexchange/loading.vue'

export default {
  data () {
    return {
      dataType: '',
      searchLabelActive: false,
      dataRenew: false,
      currentItem: {},
      isTrash: false,
      hasRootParent: false,
      currentItemComments: [],
      currentItemShares: [],
      searchItems: [],
      currentParent: {},
      currentItems: [],
      changedViewer: '',
      responseData: [],
      dataIsLoading: true,
      tick: 0,
      currentLabel: {},
      dataTypeID: 0,
      backendJSEvents: {
        getDESearchItemsLabel: function (data, self) {
          let index = -1
          // check if has data
          if (data.data.length > 0) {
            // check if index is not null and slice
            if (index !== null) {
              let parents = self.getCurrentParents.slice(0, index + 1)
              self.$store.dispatch('resetParents', parents)
              self.currentItems = []
              self.currentItems = self.currentItems.concat(data.data)
              EventBus.$emit('resetItemsPage', {type: 'searchByLabel', label: self.currentLabel})
            }
            self.searchLabelActive = true
          }
          EventBus.$emit('showLoadingGetItem', false)
        },
        getDESearchItems: function (data, self) {
          EventBus.$emit('showLoadingGetItem', false)
          self.searchItems = []
          if (data.data.length > 0) {
            self.searchItems = self.searchItems.concat(data.data)
          }
        },
        getDataExchange: function (data, self) {
          EventBus.$emit('showLoadingGetItem', false)
          self.currentItems = self.currentItems.concat(data.data.data)
          self.currentParent = data.data.parent
          self.$store.dispatch('selectParent', data.data.parent)
          if (!self.hasRootParent) {
            self.$store.dispatch('selectRootParent', data.data.parent)
            self.hasRootParent = true
          }
        },
        getDEParent: function (data, self) {
          EventBus.$emit('showLoadingGetItem', false)
          if (data.data.data.length > 0) {
            self.currentItems = self.currentItems.concat(data.data.data)
          }
        },
        getDEItem: function (data, self) {
          EventBus.$emit('showLoadingGetItem', false)
          if (data.data.length > 0) {
            let firstItem = data.data[0]
            // update counter size
            if (self.getCurrentItem.id === firstItem.parent_id) {
              self.$store.dispatch('updateCurrentItemSize', {size: firstItem.size})
            }
            // add to list if select parent is current item
            if (self.getSelectedParent.id === firstItem.parent_id) {
              let old = self.currentItems
              self.currentItems = data.data.concat(old)
            }
          }
        },
        getDEItemComments: function (data, self) {
          EventBus.$emit('showLoadingComments', false)
          EventBus.$emit('showLoadingGetItem', false)
          if (data.data.length > 0) {
            self.currentItemComments = self.currentItemComments.concat(data.data)
          }
        },
        getDEItemComment: function (data, self) {
          EventBus.$emit('showLoadingComments', false)
          let old = self.currentItemComments
          self.currentItemComments = data.data.concat(old)
        },
        getDEItemShares: function (data, self) {
          EventBus.$emit('showLoadingGetShares', false)
          if (data.data.length > 0) {
            self.currentItemShares = self.currentItemShares.concat(data.data)
          }
        },
        postDEItemShare: function (data, self) {
          EventBus.$emit('showLoadingGetShares', false)
          let old = self.currentItemShares
          self.currentItemShares = data.data.concat(old)
        },
        postDataExchange: function (data, self) {
          EventBus.$emit('showLoadingGetItem', true)
          self.sendGet('de/item', '/' + data.data.hash)
        },
        postDEItemComment: function (data, self) {
          EventBus.$emit('showLoadingComments', true)
          self.sendGet('de/item/comment', '/' + data.data.id)
        }
      }
    }
  },
  mixins: [
    backendMixin,
    dataMixin,
    onEventsMixin
  ],
  computed: {
    returnType: {
      get () {
        this.dataType = this.type
        return this.dataType
      },
      set (val) {
        this.dataType = val
        this.$emit('set', this.dataType)
      }
    },
    returnTypeID: {
      get () {
        this.dataTypeID = this.typeID
        return this.dataTypeID
      },
      set (val) {
        this.dataTypeID = val
        this.$emit('set', this.dataTypeID)
      }
    },
    returnRenew: {
      get () {
        this.dataRenew = this.renew
        return this.dataRenew
      },
      set (val) {
        this.dataRenew = val
        this.$emit('set', this.dataRenew)
      }
    },
    returnChangeViewer: {
      get () {
        this.changedViewer = this.changeViewer
        return this.changedViewer
      },
      set (val) {
        this.changedViewer = val
        this.$emit('set', this.changedViewer)
      }
    },
    ...mapGetters(['getToken', 'getUser', 'getSelectedParent', 'getCurrentParents', 'getCurrentItem', 'getSelectedRootParent'])
  },
  watch: {
    returnRenew: function (val) {
      let index = -1
      this.onJoinFolder(this.getSelectedRootParent)
      // check if index is not null and slice
      if (index !== null) {
        let parents = this.getCurrentParents.slice(0, index + 1)
        this.$store.dispatch('resetParents', parents)
      }
    }
  },
  props: {
    type: {
      type: String,
      default: () => {
        return ''
      }
    },
    typeID: {
      type: Number,
      default: () => {
        return 0
      }
    },
    renew: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    changeViewer: {}
  },
  components: {
    deItems,
    deItem,
    itemsPath,
    loader,
    deViewer,
    deSearch
  },
  mounted () {
    EventBus.$on('GetBackendJs', data => {
      return this.GetBackendJs(data)
    })
    EventBus.$on('PostBackendJs', data => {
      return this.PostBackendJs(data)
    })
    EventBus.$on('PutBackendJs', data => {
      return this.PutBackendJs(data)
    })
    EventBus.$on('showLoadingGetItem', data => {
      this.dataIsLoading = data
    })
    EventBus.$on('showLoadingGetDE', data => {
      this.dataIsLoading = data
    })
    EventBus.$on('changedViewer', data => {
      this.processChange(data)
    })
    EventBus.$on('searchDE', data => {
      this.onSearchDE(data)
    })
    EventBus.$on('selectedSearchItem', data => {
      this.onSelectSearchItem(data)
    })
    EventBus.$on('searchByLabel', data => {
      this.currentLabel = data
      this.onSearchByLabel(data)
    })
  },
  created () {
    this.getDataExchangeView()
    this.updateMsgTime()
    this.$store.dispatch('clearParents', [])
  },
  methods: {
    onSelectSearchItem: function (data) {
      this.searchItems = []
    },
    processChange: function (data) {
      // check data value
      if (data.data === 'getTrashFiles') {
        let index = -1
        // check if index is not null and slice
        if (index !== null) {
          let parents = this.getCurrentParents.slice(0, index + 1)
          this.$store.dispatch('resetParents', parents)
        }
        this.currentItems = []
        let makeParams = '?trash=1'
        this.sendGet('data/exchange', makeParams)
        this.isTrash = true
      }
    },
    updateMsgTime: function () {
      var self = this
      setInterval(function () {
        self.tick = 1
        self.tick = 0
      }, 60 * 1000)
    },
    GetBackendJs: function (data) {
      // get requested api path
      var globalPath = data.path
      // check requests response
      if (globalPath === 'data/exchange') {
        // get data exchange (initial request)
        this.backendJSEvents['getDataExchange'](data, this)
      } else if (globalPath === 'de/parent') {
        // get parent data
        this.backendJSEvents['getDEParent'](data, this)
      } else if (globalPath === 'de/item') {
        // get data exchange item
        this.backendJSEvents['getDEItem'](data, this)
      } else if (globalPath === 'de/item/comments') {
        // get data exchange item comments
        this.backendJSEvents['getDEItemComments'](data, this)
      } else if (globalPath === 'de/item/comment') {
        // get data exchange item comment
        this.backendJSEvents['getDEItemComment'](data, this)
      } else if (globalPath === 'de/share') {
        // get data exchange item shares
        this.backendJSEvents['getDEItemShares'](data, this)
      } else if (globalPath === 'de/item/search') {
        // items on search
        this.backendJSEvents['getDESearchItems'](data, this)
      } else if (globalPath === 'de/items/label') {
        // items on search
        this.backendJSEvents['getDESearchItemsLabel'](data, this)
      }
    },
    PostBackendJs: function (data) {
      // get requested api path
      var globalPath = data.path
      // check requests response
      if (globalPath === 'data/exchange') {
        // post data exchange item
        this.backendJSEvents['postDataExchange'](data, this)
      } else if (globalPath === 'de/item/comment') {
        // post comment
        this.backendJSEvents['postDEItemComment'](data, this)
      } else if (globalPath === 'de/share') {
        this.backendJSEvents['postDEItemShare'](data, this)
      }
    },
    PutBackendJs: function (data) {
      // get requested api path
      var globalPath = data.path
      if (globalPath === 'de/permissions') {
        EventBus.$emit('showLoadingGetShares', false)
      }
    },
    getDataExchangeView: function () {
      EventBus.$emit('showLoadingGetDE', true)
      // if type and id is set
      if (this.returnType !== '' && this.returnTypeID !== 0) {
        let makeParams = '/' + this.returnType + '?id=' + this.returnTypeID
        this.sendGet('data/exchange', makeParams)
      } else {
        this.sendGet('data/exchange')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.de-container {
  text-align: left;
  padding-left: 1em;
  padding-right: 1em;
  display: block;
}

.items-path {
  margin-bottom: 1em;
  font-weight: bold;
}

.loader-items {
  width: 35px;
  margin-top: 2em;
  height: 35px;
}

.search-container{
  display: block;
  margin-top: 2em;
}
</style>
