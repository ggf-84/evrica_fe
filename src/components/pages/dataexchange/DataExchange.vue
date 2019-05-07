<template>
<div class="de-container">
  <!-- <el-button type="info" @click="dialogVisible = true" class="btn-switch">Switch to department</el-button> -->
    <!-- row start -->
    <el-row :gutter="20">

      <!-- column start -->
      <el-col :span="4">
        <!-- items grouping start -->
        <categoryViewer @getAllFiles="onGetAllFiles($event)"
                        :categories="currentCategories"
                        @loadCategories="onLoadCategories($event)"
                        @deleteLabel="onDeleteLabel($event)"
                        @getTrashFiles="onGetTrashFiles($event)"
                        ></categoryViewer>
        <!-- items grouping end -->
      </el-col>
      <!-- column end -->

      <!-- column start -->
      <el-col :span="20">
        <deViewer :changeViewer="viewerData" type="department" :typeID="departmentID" :renew="renew"></deViewer>
      </el-col>
      <!-- column end -->

    </el-row>
    <!-- row end  -->

  <!-- <el-dialog
  title="Search a department"
  :visible.sync="dialogVisible"
  width="30%">
  <div>
    <el-autocomplete
  v-model="state4"
  class="select-department"
  :fetch-suggestions="querySearchAsync"
  placeholder="Please input"
  @select="handleSelect"
></el-autocomplete>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
  </span>
</el-dialog> -->
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import deViewer from '../../modules/dataexchange/deViewer.vue'
import dataMixin from '../../../mixins/modules/dataexchange/dataModifier.js'
import backendMixin from '../../../mixins/modules/dataexchange/backend.js'
import categoryViewer from '../../modules/dataexchange/category/listCategories.vue'
import {
  EventBus
} from '../../../mixins/modules/dataexchange/eventBus.js'

export default {
  name: 'DataExchange',
  data () {
    return {
      viewerData: {},
      departmentID: 0,
      dialogVisible: false,
      renew: false,
      links: [],
      state4: '',
      timeout: null,
      currentCategories: [],
      currentCategoriesPage: 1,
      currentCategoriesLimit: 5,
      backendJSEvents: {
        getDECategories: function (data, self) {
          if (data.data.length > 0) {
            self.currentCategories = self.currentCategories.concat(data.data)
          }
        }
      }
    }
  },
  mixins: [
    backendMixin,
    dataMixin
  ],
  computed: {
    ...mapGetters(['getToken', 'getUser', 'getSelectedParent'])
  },
  components: {
    deViewer,
    categoryViewer
  },
  mounted () {
    EventBus.$on('GetBackendJs', data => {
      return this.GetBackendJs(data)
    })
    EventBus.$on('refreshLabels', data => {
      this.currentCategories = []
      this.currentCategoriesPage = 1
      let makeParams = '?_with=user,color&_sort=-id&_limit=' + this.currentCategoriesLimit + '&_page=' + this.currentCategoriesPage
      this.sendGet('de/label', makeParams)
    })
    this.links = this.loadAll()
  },
  created () {
    let makeParams = '?_with=user,color&_sort=-id&_limit=' + this.currentCategoriesLimit + '&_page=' + this.currentCategoriesPage
    this.sendGet('de/label', makeParams)
  },
  methods: {
    GetBackendJs: function (data) {
      // get path
      var globalPath = data.path
      // check path
      if (globalPath === 'de/label') {
        // get categories
        this.backendJSEvents['getDECategories'](data, this)
      }
    },
    onGetTrashFiles: function (data) {
      let dataChange = {data: 'getTrashFiles'}
      EventBus.$emit('changedViewer', dataChange)
    },
    onDeleteLabel: function (data) {
      let makeParams = '/' + data.id
      this.sendDelete('de/label', makeParams)
    },
    onGetAllFiles: function (data) {
      if (!this.renew) {
        this.renew = true
      } else {
        this.renew = false
      }
    },
    onLoadCategories: function (data) {
      let makeParams = '?_with=user,color&_sort=-id&_limit=' + data.limit + '&_page=' + data.page
      this.sendGet('de/label', makeParams)
    },
    loadAll () {
      return [
         { 'value': 'vue', 'link': 'https://github.com/vuejs/vue' },
         { 'value': 'element', 'link': 'https://github.com/ElemeFE/element' },
         { 'value': 'cooking', 'link': 'https://github.com/ElemeFE/cooking' },
         { 'value': 'mint-ui', 'link': 'https://github.com/ElemeFE/mint-ui' },
         { 'value': 'vuex', 'link': 'https://github.com/vuejs/vuex' },
         { 'value': 'vue-router', 'link': 'https://github.com/vuejs/vue-router' },
         { 'value': 'babel', 'link': 'https://github.com/babel/babel' }
      ]
    },
    querySearchAsync (queryString, cb) {
      var links = this.links
      var results = queryString ? links.filter(this.createFilter(queryString)) : links

      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        cb(results)
      }, 3000 * Math.random())
    },
    createFilter (queryString) {
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      console.log(item)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.de-container {
  text-align: left;
  overflow: hidden;
}
.btn-switch {
  margin-left: 1em;
  margin-bottom: 1em;
}

.select-department {
  width: 100%;
}
</style>
