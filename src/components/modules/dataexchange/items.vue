<template>
<div>

  <div class="items-container" ref="itemsContainer">

    <div v-for="(dataItem, indx) in returnItemsList" :key="indx" class="de-item" v-if="parseInt(returnItemsList.length) !== 0">
      <div @click="showItemDetails(dataItem)" :class="{'de-item-data': true , 'de-item-data-selected': false}">
        <i class="icon-item el-icon-tickets folderClass" v-if="dataItem.extension === 'folder'" @click="joinFolder(dataItem)"></i>
        <i class="icon-item el-icon-document" v-else></i>
        <span v-if="dataItem.extension === 'folder'" @click="joinFolder(dataItem)" class="folderClass">{{dataItem.title}}</span>
        <span v-else>{{dataItem.title}}</span>
        <span class="modified-on">(last modified {{localeTime(dataItem.mtime)}})</span>
        <span class="labels-list"><labels :item="dataItem" :labels="dataItem.label" @attachItemLabel="onAttachItemLabel($event)" @detachItemLabel="onDetachItemLabel($event)"></labels></span>
        <span v-if="dataItem.trash === null"><el-button class="button-new-tag" type="danger" size="small" @click="moveToTrash(dataItem, indx)">Move to trash</el-button></span>
        <span v-else>
          <el-button class="button-new-tag" type="danger" size="small" @click="restoreFromTrash(dataItem, indx)"><i class="el-icon-refresh"></i> Restore from trash</el-button>
        </span>
      </div>
    </div>

    <div v-if="parseInt(returnItemsList.length) === 0">
      <span>No items available</span>
    </div>
  </div>
  <div>
    <hr>
  </div>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import dataMixin from '../../../mixins/modules/dataexchange/dataModifier.js'
import backendMixin from '../../../mixins/modules/dataexchange/backend.js'
import { EventBus } from '../../../mixins/modules/dataexchange/eventBus'
import labels from './itemLabels'

export default {
  data () {
    return {
      dataItems: [],
      dataFolders: 0,
      dataFiles: 0,
      dataText: '',
      lastScrollItems: false,
      pageHeightItems: 0,
      itemsBottom: false,
      searchByLabel: false,
      currentLabel: {},
      currentItemsPage: 1,
      backendJSEvents: {
        getItemLabel: function (data, self) {
          if (parseInt(data.data.length) > 0) {
            // get first element
            let dataItem = data.data.shift()
            // get item data
            var hasItem = dataItem.item
            // find item
            let getItemArray = self.dataItems.find(item => item.id === hasItem.id)
            // find index of found item
            let indexItemArray = self.dataItems.indexOf(getItemArray)
            // get found item from array
            let elementArray = self.dataItems[indexItemArray]
            // add label in item's label array
            if (typeof elementArray !== 'undefined') {
              elementArray['label'] = elementArray['label'].concat(dataItem)
            }
          }
          EventBus.$emit('showLoadingGetItem', false)
          EventBus.$emit('refreshLabels', true)
        }
      }
    }
  },
  computed: {
    returnItemsList: {
      get () {
        this.dataItems = this.items
        return this.dataItems
      },
      set (val) {
        this.dataItems = val
        this.$emit('set', this.dataItems)
      }
    },
    ...mapGetters(['getToken', 'getUser', 'getCurrentItem'])
  },
  mixins: [
    dataMixin,
    backendMixin
  ],
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    labels
  },
  mounted () {
    EventBus.$on('resetItemsPage', data => {
      this.currentItemsPage = 1
      this.currentLabel = {}
      if (typeof data.type !== 'undefined') {
        this.currentLabel = data.label
        this.searchByLabel = true
      }
    })
    EventBus.$on('PostBackendJs', data => {
      return this.PostBackendJs(data)
    })
    EventBus.$on('GetBackendJs', data => {
      return this.GetBackendJs(data)
    })
  },
  created () {
  },
  updated () {
    var self = this
    // listen scroll items
    let windowItems = this.$refs.itemsContainer
    if (windowItems) {
      windowItems.addEventListener('scroll', () => {
        this.itemsBottom = this.bottomItemsVisible()
        if (this.itemsBottom) {
          this.currentItemsPage++
          if (typeof this.currentLabel.id !== 'undefined') {
            this.$emit('loadItems', {page: this.currentItemsPage, type: 'searchByLabel', label: this.currentLabel})
          } else {
            this.$emit('loadItems', {page: this.currentItemsPage})
          }
          this.$nextTick(function () {
            let container = self.$refs.itemsContainer
            container.scrollTo(0, self.pageHeightItems)
          })
        }
      })
    }
  },
  methods: {
    showItemDetails: function (item) {
      this.$store.dispatch('setCurrentItem', item)
      this.$emit('showItemDetails', item)
      EventBus.$emit('changeShareActiveItem', {title: 'first'})
    },
    handleEdit (index, row) {
    },
    moveToTrash: function (data, indx) {
      this.$delete(this.dataItems, indx)
      this.$emit('moveToTrash', data)
    },
    restoreFromTrash: function (data, indx) {
      this.$delete(this.dataItems, indx)
      this.$emit('removeFromTrash', data)
    },
    handleDelete (index, row) {
    },
    PostBackendJs: function (data) {
      // get path
      var globalPath = data.path
      // check path
      if (globalPath === 'de/label/item') {
        let makeParams = '?_with=item&_filters[]=id-eq=' + data.data.id
        this.sendGet('de/item/label', makeParams)
        EventBus.$emit('showLoadingGetItem', true)
      } else if (globalPath === 'de/item/label') {
        let makeParams = '?_with=item&_filters[]=id-eq=' + data.data.id
        this.sendGet('de/item/label', makeParams)
        EventBus.$emit('showLoadingGetItem', true)
      }
    },
    GetBackendJs: function (data) {
      // get path
      var globalPath = data.path
      // check path
      if (globalPath === 'de/item/label') {
        // get item label
        this.backendJSEvents['getItemLabel'](data, this)
      }
    },
    joinFolder: function (item) {
      this.$emit('joinFolder', item)
    },
    onDetachItemLabel: function (data) {
      this.$emit('detachItemLabel', data)
    },
    onAttachItemLabel: function (data) {
      this.$emit('attachItemLabel', data)
    },
    bottomItemsVisible () {
      let windowItems = this.$refs.itemsContainer
      let scrollY = windowItems.scrollTop
      let visible = windowItems.clientHeight
      let pageHeight = windowItems.scrollHeight
      let bottomOfPage = visible + (scrollY + 10) >= pageHeight

      if (!this.lastScrollItems && bottomOfPage) {
        this.lastScrollItems = true
        this.pageHeightItems = pageHeight
        return true
      } else if (this.lastScrollItems && bottomOfPage) {
        this.lastScrollItems = true
        return false
      } else if (!bottomOfPage) {
        this.lastScrollItems = false
        return false
      }

      return bottomOfPage || pageHeight < visible
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.de-item{
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1em;
}
.de-item-data{
  padding: 1em;
  transition: 0.2s;
}
.de-item-data-selected {
  padding: 1em;
  transition: 0.2s;
  background-color: #f2f2f2;
}
.de-item-data:hover{
  background-color: #f2f2f2;
}
.item-counters{
  font-weight: bold;
}

.items-container{
  max-height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
}

.icon-item{
  font-size: 2em;
}

.modified-on{
  color: #ccc;
}

.folderClass{
  color: #3d8ff8;
}

.folderClass:hover{
  text-decoration: underline;
}

.labels-list {
  margin-top: 1em;
  display: inline-block;
  margin-left: 1em;
}
</style>
