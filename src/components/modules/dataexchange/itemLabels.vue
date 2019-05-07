<template>
<div>
  <el-tag class="tag-list-item" v-for="(dataLabel, indx) in returnLabels" :key="indx" closable @close="handleClose(indx)" :style="{ 'background-color': getColorCode(dataLabel.label) }">
    <!-- {{dataLabel.label.title}} {{dataLabel.label}} -->
    <span v-if="dataLabel.label !== null">{{dataLabel.label.title}}</span>
    <span v-else>unknown</span>
  </el-tag>
  <el-button class="button-new-tag" size="small" @click="showDialogInput()">+ New label</el-button>

    <el-dialog
  :title="'Add label to ' + currentItem.title"
  :visible.sync="dialogVisible"
  width="30%">
  <div>
    <el-button @click="addNewLabel()">{{textButton}}</el-button>
  </div>
  <div v-if="showAddNew">
    <span class="add-new-label">
      <b>Add new</b>
    </span>
    <el-input placeholder="Label name" v-model="inputTitle"></el-input>
    <div class="block">
      <el-color-picker v-model="color"></el-color-picker>
    </div>
  </div>
  <hr>
  <div v-if="showSearch">
    <div>
      <el-select
      v-model="selectedLabel"
      filterable
      remote
      reserve-keyword
      class="input-searched"
      placeholder="Search label by title"
      :remote-method="remoteMethod"
      :loading="loading">
      <el-option
        v-for="(itemLabel, indx) in apiLabels"
        :key="itemLabel.id"
        :label="itemLabel.title"
        :value="indx">
        <!-- item -->
        <span>{{itemLabel.title}}</span>
      </el-option>
    </el-select>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">Cancel</el-button>
    <el-button type="primary" @click="confirmLabel()">Confirm</el-button>
  </span>
</el-dialog>

</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import dataMixin from '../../../mixins/modules/dataexchange/dataModifier.js'
import notification from '../../../mixins/modules/notifications/notification'

export default {
  data () {
    return {
      dataLabels: [],
      color: '#409EFF',
      textButton: 'Add new label',
      selectedLabel: '',
      inputTitle: '',
      dataItem: {},
      showAddNew: false,
      showSearch: true,
      loading: false,
      apiLabels: [],
      inputVisible: false,
      inputValue: '',
      dialogVisible: false,
      currentItem: {}
    }
  },
  mixins: [
    dataMixin
  ],
  watch: {
    color: function (val) {
      if (val === null) {
        this.color = '#409EFF'
      }
    }
  },
  computed: {
    returnLabels: {
      get () {
        this.dataLabels = this.labels
        return this.dataLabels
      },
      set (val) {
        this.dataLabels = val
        this.$emit('set', this.dataLabels)
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
    ...mapGetters(['getToken', 'getUser'])
  },
  props: {
    labels: {
      type: Array,
      default: () => {
        return []
      }
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {},
  mounted () {},
  created () {},
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        var self = this
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.$http.get('de/label?_filters[]=title-lk=' + '*' + query + '*').then(response => {
            this.loading = false
            self.apiLabels = response.body.data
          })
        }, 200)
      } else {
        this.apiLabels = []
      }
    },
    addNewLabel: function () {
      if (!this.showAddNew) {
        this.textButton = 'Search label'
        this.showAddNew = true
        this.showSearch = false
      } else {
        this.textButton = 'Add new label'
        this.showAddNew = false
        this.showSearch = true
      }
    },
    getColorCode: function (data) {
      if (data !== null) {
        return data.color.color
      } else {
        return '#000'
      }
    },
    handleClose (indx) {
      let dataLabel = this.dataLabels[indx]
      this.dataLabels.splice(indx, 1)
      this.$emit('detachItemLabel', dataLabel)
    },
    showDialogInput: function () {
      this.dialogVisible = true
      this.currentItem = this.returnItem
      this.selectedLabel = ''
      this.apiLabels = []
      this.inputTitle = ''
    },
    confirmLabel: function () {
      this.inputTitle = this.inputTitle.trim()
      if (this.showAddNew) {
        if (this.inputTitle && this.inputTitle.length) {
          let data = {type: 'createdLabel', title: this.inputTitle, color: this.color, item: this.returnItem, user: this.getUser}
          this.$emit('attachItemLabel', data)
          this.dialogVisible = false
        } else {
          notification.error('System !', 'Add label name')
        }
      } else {
        if (this.selectedLabel !== '') {
          let data = this.apiLabels[this.selectedLabel]
          this.$emit('attachItemLabel', {type: 'selectedLabel', data: data, item: this.returnItem, user: this.getUser})
          this.dialogVisible = false
        } else {
          notification.error('System !', 'Select label')
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.label-text-color {
  display: inline-block;
  margin-right: 1em;
  border-radius: 5px;
  font-weight: bold;
  color: #fff;
  padding: 0.2em;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.tag-list-item {
  display: inline-block;
  margin-right: 1em;
  color: #fff;
  font-weight: bold;
}

.input-new-tag {
  margin-top: 1em;
}

.label-text-dialog {
  display: block;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.add-new-label {
  display: inline-block;
  margin-bottom: 1em;
}
</style>
