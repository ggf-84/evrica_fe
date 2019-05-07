<template>
  <div class="checklist">
    <el-progress :percentage="progress"  v-if="getItem.id?updateProgress():false"></el-progress>

    <el-row :gutter="20">
    <el-col :md="24"  v-for="item in getItem.items" :key="item.id" class="checkListItem">
        <!-- listitems-->
        <el-checkbox @change="changeValue($event,item)"
        :checked="parseInt(item.is_done) === 1?true:false"
        :label="item.id">&nbsp;</el-checkbox>

          <inline class="checkbox-title" style="display:inline-block;" v-model="item.content" @change="changeValue(item.is_done,item)"/>

          <span title="Remove item" class="remove-item" @click="removeItem(item)"><i class="el-icon-close" style="text-align:right;"></i></span>
    </el-col>
    </el-row>


      <el-row :gutter="20">
        <el-col :md="24" class="btn-label">
          <span v-if="!showAdd" @click="changeView">{{$t('add_an_item')}}...</span>
          <el-col :xs="24">
           <el-input ref="element" :placeholder="$t('add_an_item')" v-if="showAdd" v-model="newListElement" size="small"></el-input>
          </el-col>
          <el-col :xs="24" style="margin-top:10px;">
            <el-button size="mini" v-if="showAdd" type="success" @click="addItem()">{{$t('add')}}</el-button>
            <el-button size="mini" v-if="showAdd" @click="clearAdd">X</el-button>
          </el-col>
        </el-col>
      </el-row>

  </div>
</template>
<script>
import Vue from 'vue'
import inline from '../pm/inline'
export default {
  name: 'pmCheclists',
  data () {
    return {
      list: {},
      showAdd: false,
      checkList: [],
      newListElement: '',
      progress: 0,
      events: {
        addChecklistItem: (data, self) => {
          self.updateProgress()
        }
      }
    }
  },
  computed: {
    getItem: {
      get () {
        this.item = this.value
        return this.item
      },
      set (val) {
        this.item = val
        this.$emit('input', val)
      }
    }
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    inline
  },
  methods: {
    changeView: function () {
      if (this.showAdd) {
        this.showAdd = false
      } else {
        this.showAdd = true
        this.$nextTick(() => this.$refs.element.focus())
      }
    },
    clearAdd: function () {
      this.showAdd = false
      this.newListElement = ''
    },
    getProgress: function () {
      let value = 0
      let total = 0

      if (this.getItem.items) {
        total = this.getItem.items.length
      }
      let checked = 0

      this.getItem.items.forEach(element => {
        if (parseInt(element.is_done) === 1) {
          checked += 1
        }
      })

      value = parseInt(checked) / parseInt(total) * 100
      if (!value) {
        return 0
      }
      console.log('progress')
      return Math.round(value)
    },
    updateProgress: function () {
      this.progress = this.getProgress()
      return true
    },
    addItem: function () {
      let request = {
        event: 'addChecklistItem',
        data: {
          checklist: this.getItem.id,
          title: this.newListElement
        }
      }

      this.showAdd = false
      this.newListElement = ''
      this.$socket.json.send(request)
    },
    changeValue: function (value, element) {
      if (value) {
        element.is_done = 1
      } else {
        element.is_done = 0
      }
      // send request
      let request = {
        event: 'updateChecklistItem',
        data: {
          item: element.id,
          status: element.is_done,
          content: element.content
        }
      }

      this.$socket.json.send(request)
      this.updateProgress()
    },
    removeItem (item) {
      let request = {
        event: 'removeItem',
        data: {
          item: item.id
        }
      }

      let indx = this.getItem.items.indexOf(item)

      if (indx > -1) {
        this.getItem.items.splice(indx, 1)
        this.updateProgress()
      }

      this.$socket.json.send(request)
    }
  },
  sockets: {
    message: function (msg) {
      // call function on message
      if (this.events && this.events[msg.event]) {
        this.events[msg.event](msg, this)
      }
    }
  },
  created () {
    if (this.getItem.id) {
      var self = this
      Vue.nextTick(function () {
        self.updateProgress()
      })
    }
  }
}
</script>
<style scoped>
.checklist .el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.checklist .btn-label {
  display: block;
  color: #838c91;
  cursor: pointer;
  margin-bottom: 4px;
  margin-left: 0px;
}

.checklist .remove-item {
  float: right;
  display: none;
}

.checklist .checkListItem:hover .remove-item {
  display: block;
}

.checklist .remove-item {
  cursor: pointer;
  font-size: 20px;
  color: #409eff;
}
</style>
