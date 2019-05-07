<template>
  <div class="categories-container">
    <el-button class="btn-category" @click="getAllFiles()">All files</el-button>
    <el-button class="btn-category" @click="getTrashFiles()">Trash</el-button>
    <el-input
    class="searchInputCategory"
  placeholder="Search a file / folder"
  prefix-icon="el-icon-search"
  v-model="inputSearchCategory">
</el-input>
    <el-button class="btn-category">Feed - x</el-button>
    <el-button class="btn-category">Favorites - x</el-button>
    <el-button class="btn-category">Shared with you - x</el-button>
    <el-button class="btn-category">Shared with others - x</el-button>
    <el-button class="btn-category">Shared by link - x</el-button>
    <hr>
    <span class="btn-category-divider">Labels</span>
    <div class="categories-list-container" ref="categoriesContainer" v-if="parseInt(returnCategories.length) > 0">
      <div v-for="(dataCategory, indx) in returnCategories" :key="indx">
      <el-tooltip class="item" effect="dark" :content="dataCategory.title" placement="top-start">
        <el-button class="btn-category-label" :style="{ 'background-color': dataCategory.color.color }" @click="searchByLabel(dataCategory)">
          <span class="bcl-title">{{dataCategory.title}}</span>
        </el-button>
        </el-tooltip>
        <el-button type="primary" icon="el-icon-delete" class="btn-trash" @click="deleteLabel(dataCategory, indx)"></el-button>
      </div>
    </div>
    <div v-else>
      No labels display
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import dataMixin from '../../../../mixins/modules/dataexchange/dataModifier.js'
import {
  EventBus
} from '../../../../mixins/modules/dataexchange/eventBus.js'

export default {
  data () {
    return {
      startSearch: false,
      searchTimeout: null,
      dataItem: {},
      dataCategories: [],
      inputSearchCategory: '',
      lastScrollCategories: false,
      pageHeightCategories: 0,
      categoriesBottom: false,
      currentCategoriesPage: 1,
      currentCategoriesLimit: 5
    }
  },
  mixins: [
    dataMixin
  ],
  computed: {
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
    returnCategories: {
      get () {
        this.dataCategories = this.categories
        return this.dataCategories
      },
      set (val) {
        this.dataCategories = val
        this.$emit('set', this.dataCategories)
      }
    },
    ...mapGetters(['getToken', 'getUser', 'getCurrentItem'])
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    categories: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    inputSearchCategory: function (val) {
      clearTimeout(this.searchTimeout)
      var self = this
      this.searchTimeout = setTimeout(function () {
        self.searchInputCategory(val)
      }, 500)
    }
  },
  components: {
  },
  mounted () {
    EventBus.$on('selectedSearchItem', data => {
      this.onSelectSearchItem(data)
    })
  },
  created () {
  },
  updated () {
    var self = this
    // listen scroll categories
    let windowCategories = this.$refs.categoriesContainer
    if (windowCategories) {
      windowCategories.addEventListener('scroll', () => {
        this.categoriesBottom = this.bottomCategoriesVisible()
        if (this.categoriesBottom) {
          this.currentCategoriesPage++
          this.$emit('loadCategories', {page: this.currentCategoriesPage, limit: this.currentCategoriesLimit})
          this.$nextTick(function () {
            let container = self.$refs.categoriesContainer
            container.scrollTo(0, self.pageHeightCategories)
          })
        }
      })
    }
  },
  methods: {
    onSelectSearchItem: function (data) {
      this.inputSearchCategory = ''
    },
    searchByLabel: function (data) {
      EventBus.$emit('searchByLabel', data)
    },
    deleteLabel: function (data, indx) {
      this.$delete(this.dataCategories, indx)
      this.$emit('deleteLabel', data)
      // if < 5 load more
      if (parseInt(this.dataCategories.length) < 5) {
        this.$emit('loadCategories', {page: this.currentCategoriesPage, limit: this.currentCategoriesLimit})
      }
    },
    getTrashFiles: function () {
      this.$emit('getTrashFiles', true)
    },
    getAllFiles: function () {
      this.$emit('getAllFiles', '')
    },
    searchInputCategory: function (query) {
      query = query.trim()
      if (query && query.length) {
        EventBus.$emit('searchDE', {query: query})
        EventBus.$emit('showLoadingGetItem', true)
      }
    },
    bottomCategoriesVisible () {
      let windowCategories = this.$refs.categoriesContainer
      let scrollY = windowCategories.scrollTop
      let visible = windowCategories.clientHeight
      let pageHeight = windowCategories.scrollHeight
      let bottomOfPage = visible + (scrollY + 10) >= pageHeight

      if (!this.lastScrollCategories && bottomOfPage) {
        this.lastScrollCategories = true
        this.pageHeightCategories = pageHeight
        return true
      } else if (this.lastScrollCategories && bottomOfPage) {
        this.lastScrollCategories = true
        return false
      } else if (!bottomOfPage) {
        this.lastScrollCategories = false
        return false
      }

      return bottomOfPage || pageHeight < visible
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-category {
  display: inline-block;
  margin-bottom: 1em;
  width: 100%;
  text-align: left;
  font-weight: bold;
  margin-left: 0em;
  font-size: 1.1em;
}

.btn-category-label{
  display: inline-block;
  margin-bottom: 1em;
  width: 150px;
  text-align: left;
  font-weight: bold;
  font-size: 1em;
}

.categories-container{
  padding-left: 1em;
  margin-top: 5em;
  padding-right: 1em;
  border-right: 1px solid #ccc;
}

.color-display{
  display: inline-block;
  float: right;
  width: 15px;
  height: 15px;
}

.categories-list-container{
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-right: 1em;
  padding-top: 1em;

}

.btn-category-divider{
  font-weight: bold;
  color: #999999;
  display: inline-block;
  margin-bottom: 1em;
}

.btn-trash {
  display: inline-block;
}

.bcl-title{
  display:inline-block;
  width:100px;
  white-space: nowrap;
  overflow:hidden !important;
  text-overflow: ellipsis;
  color: #fff;
}

.searchInputCategory{
  margin-bottom: 1em;
}

</style>
