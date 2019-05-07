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
        <deItems :items="currentItems" @showItemDetails="onShowItemDetails($event)" @loadItems="onLoadItems($event)" @joinFolder="onJoinFolder($event)"></deItems>

        <!-- loader -->
        <div>
          <loader :loading="dataIsLoading" class="loader-items"></loader>
        </div>
        <!-- end loader -->
      </div>
      <!-- list item end -->
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
import deViewer from '../../../modules/dataexchange/deViewer.vue'
import deItems from '../../../modules/dataexchange/items.vue'
import deItem from './shareItem.vue'
import itemsPath from './itemsPath.vue'
import backendMixin from '../../../../mixins/modules/dataexchange/backend.js'
import onEventsMixin from '../../../../mixins/modules/dataexchange/deOnEvents.js'
import dataMixin from '../../../../mixins/modules/dataexchange/dataModifier.js'
import {
  EventBus
} from '../../../../mixins/modules/dataexchange/eventBus.js'
import loader from '../../../modules/dataexchange/loading.vue'

export default {
  data () {
    return {
      dataType: '',
      dataItem: {},
      dataRenew: false,
      currentItem: {},
      currentItemComments: [],
      currentItemShares: [],
      currentParent: {},
      currentItems: [],
      responseData: [],
      dataIsLoading: true,
      tick: 0,
      dataTypeID: 0,
      backendJSEvents: {
        getDataExchange: function (data, self) {
          EventBus.$emit('showLoadingGetItem', false)
          self.currentItems = self.currentItems.concat(data.data.data)
          self.currentParent = data.data.parent
          self.$store.dispatch('selectParent', data.data.parent)
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
    returnItem: {
      get () {
        this.dataItem = this.item
        return this.dataItem
      },
      set (val) {
        this.dataItem = val
        this.$emit('set', this.dataItem)
      }
    },
    returnShareToken: {
      get () {
        this.dataShareToken = this.shareToken
        return this.dataShareToken
      },
      set (val) {
        this.dataShareToken = val
        this.$emit('set', this.dataShareToken)
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
    ...mapGetters(['getToken', 'getUser', 'getSelectedParent', 'getCurrentItem'])
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
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
    shareToken: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  components: {
    deItems,
    deItem,
    itemsPath,
    loader,
    deViewer
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
  },
  created () {
    this.getDataExchangeView()
    this.updateMsgTime()
    this.$store.dispatch('clearParents', [])
  },
  methods: {
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
      this.currentItem = this.returnItem.item
      EventBus.$emit('showLoadingGetDE', true)
      // if type and id is set
      if (this.returnType !== '' && this.returnTypeID !== 0) {
        let makeParams = '/' + this.returnType + '?id=' + this.returnTypeID
        this.sendGet('data/exchange', makeParams)
      } else {
        let makeParams = '/share' + '/' + this.returnShareToken
        this.sendGet('data/exchange', makeParams)
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
</style>
