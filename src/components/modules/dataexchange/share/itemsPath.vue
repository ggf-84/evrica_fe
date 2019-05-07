<template>
<div>
  <div>
  <!-- store parents path  -->
  <div>
    <span>
      <el-tooltip content="Home" placement="top">
        <el-button @click="joinFolder(returnParent, -1)"><i class="el-icon-menu"></i></el-button>
      </el-tooltip>
    </span>
    <span class="path-item"> > </span>
    <span v-for="(storeParent, indx) in getCurrentParents" :key="indx" v-if="getCurrentParents.length !== 0">
      <el-tooltip :content="storeParent.title" placement="top">
        <el-button @click="joinFolder(storeParent, indx)">{{storeParent.title}}</el-button>
      </el-tooltip>
      <span class="path-item" v-if="indx !== parseInt(getCurrentParents.length - 1)"> > </span>
    </span>
  </div>
<!-- end store parent path -->

<div>
  <el-button type="info" icon="el-icon-plus" @click="dialogVisible = true" v-if="getSelectedParent.extension === 'folder' && hasPermission('create')">Create</el-button>
  <el-upload class="upload-demo" v-if="hasPermission('upload') && getSelectedParent.extension === 'folder' || getSelectedParent.parent_id === null" name="files" :action="getUploadAction()" multiple :limit="uploadLimit" :show-file-list="false" :on-exceed="handleExceed" :on-error="handleError" :on-success="handleSuccess" :file-list="fileList">
    <el-button type="primary" icon="el-icon-upload2">Upload</el-button>
  </el-upload>
</div>
  </div>
  <hr>

  <!-- create item dialog -->
  <el-dialog
  title="Create"
  :visible.sync="dialogVisible"
  width="20%">
  <div>
        <el-button @click="createItem('folder', 'Folder')" class="btn-item-option" size="small">Folder</el-button>
        <el-button @click="createItem('docx', 'Document')" class="btn-item-option" size="small">Document</el-button>
        <el-button @click="createItem('xlsx', 'Spreadsheet')" class="btn-item-option" size="small">Spreadsheet</el-button>
        <el-button @click="createItem('pptx', 'Presentation')" class="btn-item-option" size="small">Presentation</el-button>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
  </span>
  </el-dialog>
  <!-- end create item dialog -->

  <!-- item name input dialog -->
  <el-dialog
  :title="'Create ' + dialogItemTitleHeading"
  :visible.sync="dialogItemTitleVisible"
  width="30%">
  <div>
      <el-input placeholder="Please input a title" @keyup.enter="confirmDialogItemTitle" v-model="itemTitleInput"></el-input>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancelDialogItemTitle">Cancel</el-button>
    <el-button type="primary" @click="confirmDialogItemTitle">Confirm</el-button>
  </span>
  </el-dialog>
  <!-- end item name input dialog -->

</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import dataMixin from '../../../../mixins/modules/dataexchange/dataModifier.js'
import functionsMixin from '../../../../mixins/modules/dataexchange/functions.js'
import notification from '../../../../mixins/modules/notifications/notification'

export default {
  data () {
    return {
      dataParent: {},
      dialogItemTitleVisible: false,
      dialogVisible: false,
      itemTitleInput: '',
      dialogItemTitleHeading: '',
      currentExtension: '',
      parentPath: [],
      uploadLimit: 3,
      fileList: []
    }
  },
  mixins: [
    dataMixin,
    functionsMixin
  ],
  computed: {
    returnParent: {
      get () {
        this.dataParent = this.parent
        return this.dataParent
      },
      set (val) {
        this.dataParent = val
        this.$emit('set', this.dataParent)
      }
    },
    ...mapGetters(['getToken', 'getUser', 'getCurrentParents', 'getCurrentItem', 'getSelectedParent'])
  },
  props: {
    parent: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
  },
  updated () {
  },
  mounted () {
  },
  created () {
  },
  methods: {
    joinFolder: function (item, index = null) {
      this.$emit('joinFolder', item)
      // check if index is not null and slice
      if (index !== null) {
        let parents = this.getCurrentParents.slice(0, index + 1)
        this.$store.dispatch('resetParents', parents)
      }
    },
    cancelDialogItemTitle: function () {
      this.dialogItemTitleVisible = false
      this.dialogVisible = true
    },
    confirmDialogItemTitle: function () {
      this.itemTitleInput = this.itemTitleInput.trim()
      if (this.itemTitleInput && this.itemTitleInput.length) {
        this.dialogItemTitleVisible = false
        this.$emit('createItem', {ext: this.currentExtension, title: this.itemTitleInput})
        this.itemTitleInput = ''
      } else {
        notification.error('System', "Can't create with empty input")
      }
    },
    createItem: function (extension, text = null) {
      this.currentExtension = extension
      this.dialogItemTitleHeading = text
      this.dialogVisible = false
      this.dialogItemTitleVisible = true
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
      if (err) {
        notification.error('System', "Can't upload file")
      }
    },
    getUploadAction: function () {
      let baseUrl = this.$BaseUrl
      let apiUrl = baseUrl + '/api/de/upload/' + this.getSelectedParent.hash
      let apiUrlToken = apiUrl + '?token=' + this.getToken

      return apiUrlToken
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-item-option {
  width: 100%;
  margin-bottom: 1em;
  margin-left: 0px;
}

.path-item{
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  margin-left: 0.2em;
  margin-right: 0.2em;
}

.upload-demo{
    display: inline-block;
}
</style>
