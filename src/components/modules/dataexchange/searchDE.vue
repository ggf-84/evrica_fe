<template>
  <div>
    <div v-if="parseInt(returnItems.length) !== 0" class="search-text">Search:</div>
    <div v-for="(dataItem, indx) in returnItems" :key="indx" class="de-item" v-if="parseInt(returnItems.length) !== 0">
      <div @click="showItemDetails(dataItem)" :class="{'de-item-data': true , 'de-item-data-selected': false}">
        <i class="icon-item el-icon-tickets folderClass" v-if="dataItem.extension === 'folder'" @click="joinFolder(dataItem)"></i>
        <i class="icon-item el-icon-document folderClass" @click="joinFolder(dataItem)" v-else></i>
        <span v-if="dataItem.extension === 'folder'" @click="joinFolder(dataItem)" class="folderClass">{{dataItem.title}}</span>
        <span v-else @click="joinFolder(dataItem)" class="folderClass">{{dataItem.title}}</span>
        <span class="modified-on">(last modified {{localeTime(dataItem.mtime)}})
          <span v-if="dataItem.trash !== null" class="in-trash">in trash</span>
        </span>
      </div>
    </div>

    <div v-if="parseInt(returnItems.length) === 0">
      <div class="search-text">Search:</div>
      <span>No items available</span>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import dataMixin from '../../../mixins/modules/dataexchange/dataModifier.js'
import labels from './itemLabels'
import { EventBus } from '../../../mixins/modules/dataexchange/eventBus'

export default {
  data () {
    return {
      dataItems: {}
    }
  },
  mixins: [
    dataMixin
  ],
  computed: {
    returnItems: {
      get () {
        this.dataItems = this.items
        return this.dataItems
      },
      set (val) {
        this.dataItems = val
        this.$emit('set', this.dataItems)
      }
    },
    ...mapGetters(['getToken', 'getUser'])
  },
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
  },
  created () {
  },
  methods: {
    showItemDetails: function (item) {
      this.$store.dispatch('setCurrentItem', item)
      this.$emit('showItemDetails', item)
      EventBus.$emit('changeShareActiveItem', {title: 'first'})
      EventBus.$emit('selectedSearchItem', true)
    },
    joinFolder: function (item) {
      if (item.extension !== 'folder') {
        this.$emit('joinFileFolder', item)
      } else {
        this.$emit('joinFolder', item)
      }
      EventBus.$emit('selectedSearchItem', true)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search-text{
  margin-bottom: 1em;
}

.folderClass{
  color: #3d8ff8;
  cursor: pointer;
}

.folderClass:hover{
  text-decoration: underline;
}

.de-item-data{
  padding-bottom: 0.5em;
  border-bottom: 1px solid #000;
  margin-bottom: 0.5em;
}

.in-trash {
  color: red;
}
</style>
