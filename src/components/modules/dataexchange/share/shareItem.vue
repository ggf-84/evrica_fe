<template>
<div>
  <div v-if="!returnItem.id">
    No item selected
  </div>
  <div v-else>
    <div>
      <mimePresenter :mime="dataItem.mime" :item="dataItem"></mimePresenter>
    </div>
    <div class="item-data-row item-title">
      <span>Title: </span> <span><b>{{returnItem.title}}</b></span>
    </div>
    <div class="item-data-row">
      <span>Shared: </span>
      <span v-if="parseInt(returnItem.is_shared) === 1"><b>shared</b></span>
      <span v-else><b>not shared</b></span>
    </div>
    <div class="item-data-row">
      <span>Size: </span> <span v-if=""><b>{{humanFileSize(returnItem.size,true)}}</b></span>
    </div>
    <div class="item-data-row">
      <span>Created: </span> <span><b>{{localeTime(returnItem.created_at)}}</b></span>
    </div>
    <div class="item-data-row">
      <span>Modified: </span> <span><b>{{localeTime(returnItem.mtime)}}</b></span>
    </div>
    <div class="item-data-row" v-if="hasPermission('download')">
      <a :href="requireDownload()" :download="returnItem.title" >
          <el-button type="primary" icon="el-icon-download">Download ( {{returnItem.title}} )</el-button>
      </a>
    </div>
    <div v-if="hasPermission('upload') && returnItem.extension === 'folder'">
      <hr>
      <el-upload class="upload-demo" name="files" :action="getUploadAction()" multiple :limit="uploadLimit" :on-exceed="handleExceed" :on-error="handleError" :on-success="handleSuccess" :file-list="fileList">
        <el-button type="primary" icon="el-icon-upload2">Upload</el-button>
      </el-upload>
    </div>
    <!-- tabs -->
    <!-- <div class="tabs-data">
      <hr>
      <el-tabs v-model="activeName">
        <el-tab-pane label="Comments" name="first">
          <div class="item-data-row-comments">
            <deItemComments :comments="returnComments" :item="returnItem" @postItemComment="onPostItemComment($event)" @loadComments="onLoadComments($event)"></deItemComments>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Sharing" name="second">
          <deItemSharing :item="returnItem" :shares="returnShares" @getShares="onGetShares($event)" @loadShares="onLoadShares($event)"></deItemSharing>
        </el-tab-pane>
      </el-tabs>
    </div> -->
    <!-- end tabs -->
  </div>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import dataMixin from '../../../../mixins/modules/dataexchange/dataModifier.js'
import deItemComments from './shareComments.vue'
import deItemSharing from './itemSharing.vue'
import mimePresenter from '../mimePresenter.vue'
import notification from '../../../../mixins/modules/notifications/notification'
import functionsMixin from '../../../../mixins/modules/dataexchange/functions.js'

export default {
  data () {
    return {
      dataItem: {},
      dataComments: [],
      dataShares: [],
      loadComments: true,
      activeName: 'second',
      uploadLimit: 3,
      fileList: []
    }
  },
  mixins: [
    dataMixin,
    functionsMixin
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
    returnComments: {
      get () {
        this.dataComments = this.comments
        return this.dataComments
      },
      set (val) {
        this.dataComments = val
        this.$emit('set', this.dataComments)
      }
    },
    returnShares: {
      get () {
        this.dataShares = this.shares
        return this.dataShares
      },
      set (val) {
        this.dataShares = val
        this.$emit('set', this.dataShares)
      }
    },
    ...mapGetters(['getToken', 'getUser'])
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    comments: {
      type: Array,
      default: () => {
        return []
      }
    },
    shares: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    deItemComments,
    mimePresenter,
    deItemSharing
  },
  mounted () {},
  created () {},
  methods: {
    onPostItemComment: function (data) {
      this.$emit('postItemComment', data)
    },
    onLoadComments: function (data) {
      this.$emit('loadComments', data)
    },
    onGetShares: function (data) {
      this.$emit('getShares', data)
    },
    onLoadShares: function (data) {
      this.$emit('loadShares', data)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`The limit is ` + this.uploadLimit + `, you selected ${files.length}`)
    },
    handleSuccess: function (response, file, fileList) {
      this.fileList = []
      notification.success('System', 'File uploaded')
      this.$emit('getCacheItem', response)
    },
    handleError: function (err, file, fileList) {
      console.log(err)
      notification.error('System', "Can't upload file")
    },
    getUploadAction: function () {
      let baseUrl = this.$BaseUrl
      let apiUrl = baseUrl + '/api/de/upload/' + this.returnItem.hash
      let apiUrlToken = apiUrl + '?token=' + this.getToken

      return apiUrlToken
    },
    requireDownload: function () {
      let url = this.$BaseUrl + '/file/' + this.returnItem.hash + '/download'
      console.log(url)
      return url
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item-data-row {
  margin-bottom: 0.5em;
}

.item-data-row-comments {
  margin-top: 1em;
}

.item-title {
  font-size: 1.2em;
}
</style>
