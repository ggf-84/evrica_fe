<template>
<div class="list-items">
    <div>


        <!-- Board Canvas-->
        <div class="board-canvas">
            <!-- Board Container-->
            <div class="list-container">
                <div class="list-wrapper" v-for="(list,index) in getLists" :key="index">
                    <div class="list" @click="setCurrent(list)">

                        <el-row>
                          <el-col :md="20">
                            <inline class="list-title" v-model="list.title" @change="updateListTitle" />
                          </el-col>
                          <el-col :md="4" >



                            <el-popover
                              ref="listPopover"
                              placement="bottom"
                              width="200"
                              trigger="click"
                              >
                                <el-button type="danger" size="mini" class="full-width-btn" @click="removeList(list.id)">Remove List</el-button>
                                <el-button size="mini" slot="reference" icon="el-icon-more"></el-button>
                            </el-popover>

                          </el-col>
                        </el-row>

                        <draggable class="list-cards" :id="list.id" v-model="list.tasks" :options="{group:'people'}" @end="drag">
                            <!-- Tasks-->
                            <div v-for="(element,key) in list.tasks" :key="key" class="task-card" @click="updateTask(element)" :id="element.id">
                                <!-- cover-->
                                <div v-if="element.cover && element.cover.thumb" class="list-card-cover js-card-cover" style="background-color: rgb(44, 116, 44); background-image: url(); height: 204.167px; background-size: cover;"></div>

                                <div class="list-card-details">
                                    <div class="list-card-labels js-card-labels">
                                        <span class="card-label card-label-red mod-card-front" v-for="(label, index) in element.labels" :key="index" :title="element.title" :style="'background:'+label.color.color">{{label}}</span>
                                    </div>
                                    <span class="list-card-title">
                                      {{element.title}}
                                    </span>
                                </div>
                            </div>
                        </draggable>
                        <div class="add-card" @click="showInsert(list.id)"><small>{{$t('add_task')}}</small></div>

                    </div>
                </div>
                <div class="list-wrapper add" @click="showAddLists">
                    <div class="add-list">
                        {{$t('add_list')}}
                    </div>
                </div>
            </div>
        </div>

    </div>


    <!-- Task dialog-->

    <el-dialog :visible.sync="editTask" @close="closeTaskModal" :width="'50%'" class="taskModal">
        <el-row :gutter="5" class="main-card-container" >
            <el-col :md="18">

                <h2 class="card-title">
                    <i class="el-icon-news"></i>
                    <inline v-model="currentTask.title" @change="updateTaskTitle" />
                </h2>
                <el-col :xs="24" class="task-from-list" v-if="currentTask.parent">
                    {{$t('in_list')}} <span>{{currentTask.parent.title}}</span>
                </el-col>

                <el-col :xs="24" v-if="currentTask.due_date">
                    <h3 class="task-detail-item-header">
                        {{$t('due_date')}}
                    </h3>
                    <span class="date-container" @click="showUpdateDate">{{formatDate(currentTask.due_date)}}</span>
                </el-col>

                <!-- task labels-->
                <el-col :xs="24" v-if="currentTask.labels && currentTask.labels.length">
                    <h3 class="task-detail-item-header">
                        {{$t('labels')}}
                    </h3>
                    <div class="task-labels-container">
                        <el-col :xs="12" class="task-labels" v-if="currentTask.labels">
                            <span class="card-label mod-card-detail mod-clickable" :style="'background:'+label.color.color" v-for="(label,index) in currentTask.labels" :key="index">{{label.title}}</span>
                        </el-col>
                    </div>
                </el-col>

                <!-- task description-->
                <el-col :xs="24">
                    <h3 class="task-detail-item-header">
                        {{$t('description')}}
                    </h3>
                    <div class="task-description-container">
                        <span v-if="!taskEditDescription" @click="showTaskUpdateDescription">{{$t('edit')}}</span>

                        <p @click="showTaskUpdateDescription">
                            <vue-markdown v-if="!taskEditDescription && currentTask.description" :source="sanitize(currentTask.description)"></vue-markdown>
                        </p>

                        <el-col :xs="24" v-if="taskEditDescription">
                            <el-input type="textarea" :rows="4" @blur="saveTaskDescription" v-model="currentTask.description"></el-input>
                        </el-col>

                        <el-col :xs="24" v-if="taskEditDescription">
                            <el-button type="success" @click="saveTaskDescription">{{$t('edit')}}</el-button>
                        </el-col>

                    </div>
                </el-col>

                <!-- attachements-->

                <el-col :xs="24">
                    <h3><i class="el-icon-download"></i> {{$t('attachements')}}</h3>
                    <el-row :gutter="30" style="padding-left:20px;">

                        <el-col :md="24" v-for="(file,indx) in currentTask.attachments" :key="indx">

                            <div class="attachment-thumbnail">
                                <a class="attachment-thumbnail-preview js-open-viewer" :href="attachmentPath+file.path" target="_blank" :style="'background-image: url('+attachmentPath+file.thumb_path+');background-color: #f4f4f4;'" rel="noreferrer nofollow"></a>
                                <p class="attachment-thumbnail-details js-open-viewer">
                                    <span class="attachment-thumbnail-name js-attachment-name can-edit-attachment-title">
                                      <inline  v-model="file.name" @change="updateAttachementName(file)"/>
                                    </span><br/>

                                    <span class="u-block quiet attachment-thumbnail-details-title-options">
                                      <span>{{$t('added')}}
                                          <span class="date">{{formatDate(file.created_at)}}</span>
                                      </span>

                                      <span>
                                        <a class="attachment-thumbnail-details-title-options-item dark-hover js-confirm-delete" href="#">
                                          <span class="attachment-thumbnail-details-options-item-text" @click="removeAttachment(file)">{{$t('delete')}}</span>
                                        </a>
                                      </span>
                                    </span>
                                </p>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>


                <!-- CheckLists -->

                <el-col :xs="24">

                    <el-row :gutter="30" v-for="(list,key) in currentTask.checklists" :key="key">
                        <el-col :xs="24">
                            <h3>
                              <i class="el-icon-circle-check-outline"></i>
                              <inline class="list-title" v-model="list.title" @change="updateChecklistTitle(list)" />
                            </h3>
                            <checklist :value="currentTask.checklists[key]" :key="key"></checklist>
                        </el-col>
                    </el-row>

                </el-col>

                <!-- Comments -->
                <comment :key="currentTask.id" v-if="currentTask.id" :task="currentTask.id"></comment>
            </el-col>

            <!-- Sidebar-->
            <el-col :md="6">
                <el-col xs:="24" class="sidebar-head">
                    <h2>{{$t('add')}}</h2>

                    <div class="sidebar-menu">

                        <div class="menu-btn" v-popover:memberPopover>
                            <i class="el-icon-tickets"></i> {{$t('members')}}
                            <el-popover ref="memberPopover" placement="bottom" width="200" trigger="click">
                              <members :task="currentTask" :key="currentTask.id"></members>
                            </el-popover>
                        </div>

                        <div class="menu-btn" @click="loadLabels()" v-popover:colorPopover>
                            <i class="el-icon-edit"></i> {{$t('labels')}}
                            <!-- Colors popover-->
                            <el-popover ref="colorPopover" placement="bottom" width="200" trigger="click">

                                <div class="label-list" v-if="!updateLabels">

                                    <div v-for="(color,index) in colors" :key="index">
                                        <el-col :md="24">
                                            <el-col :md="18">
                                                <span @click="refreshLabel(color.id)" class="card-label mod-card-detail mod-clickable" :style="'width:100%;background:'+color.color">
                                                {{getLabelTitleByColor(color.id)}}
                                                <i class="el-icon-check" v-if="labelIsUsed(color.id)"></i>
                                                </span>
                                            </el-col>
                                            <el-col :md="6">
                                                <el-button size="mini" icon="el-icon-edit" @click="updateLabel(color)"></el-button>
                                            </el-col>
                                        </el-col>
                                    </div>

                                </div>

                                <div class="update-labels" v-if="updateLabels">

                                    <el-row :gutter="5">
                                        <el-col :md="4">
                                            <span :style="'background:'+selectedLabel.color.color"></span>
                                        </el-col>

                                        <el-col :md="20">
                                            <el-input v-model="selectedLabel.title" size="mini" />
                                        </el-col>

                                        <el-col :md="24">
                                            <el-button size="mini" @click="saveLabel">{{$t('save')}}</el-button>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-popover>

                        </div>

                        <div class="menu-btn" v-popover:checkListPopover ref="checklist">
                            <i class="el-icon-check"></i> {{$t('checklist')}}

                            <el-popover ref="checkListPopover" placement="bottom" width="200" trigger="click">
                                <el-col :md="24" class="checklistContainer">
                                    <label>{{$t('title')}}</label>
                                    <el-input v-model="newChecklist.title" :size="'small'"></el-input>
                                    <el-button type="success" size="small" @click="addChecklist">{{$t('add')}}</el-button>
                                </el-col>
                            </el-popover>
                        </div>

                        <div class="menu-btn" @click="showDueDate()" v-popover:datePopover ref="dueDate">
                            <i class="el-icon-time"></i> {{$t('due_date')}}

                            <el-popover ref="datePopover" placement="bottom" width="200" trigger="click">
                                <el-date-picker @change="setDueDate" :value-format="'yyyy-MM-dd HH:mm:ss'" type="datetime" placeholder="Select date and time" v-model="currentTask.due_date"> </el-date-picker>
                            </el-popover>
                        </div>

                        <div class="menu-btn" v-popover:attachementPop ref="attachement">
                            <i class="el-icon-upload"></i> {{$t('attachement')}}
                            <el-popover ref="attachementPop" placement="bottom" width="200" trigger="click">
                                <el-upload class="upload-pm-container" drag :action="$BaseUrl+'/api/pm/tasks/'+currentTask.id+'/attachments?token='+getToken" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="attachementSuccess" :file-list="fileList" :name="'attachments'"
                                    multiple>
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">{{$t('drop_file_or_click')}}</div>
                                    <div class="el-upload__tip" slot="tip">jpg,jpeg,png,bmp,doc,docx,xls,xlsx,pdf {{$t('files_with_a_size_less_than')}} 20mb</div>
                                </el-upload>
                            </el-popover>
                        </div>

                        <div class="menu-btn remove-btn" v-popover:removeTaskValue ref="removeTask" >
                          <i class="el-icon-close"></i> {{$t('remove_task')}}
                          <el-popover ref="removeTaskValue" v-model="showRemoveTask" placement="bottom" width="200" trigger="click">
                            {{$t('are_you_sure_to_delete_this')}} ?
                            <el-col>
                              <el-button type="success" size="mini" @click="removeTask">{{$t('yes')}}</el-button>
                              <el-button size="mini" @click="cancelRemove">{{$t('no')}}</el-button>
                            </el-col>
                          </el-popover>
                        </div>


                    </div>

                </el-col>
            </el-col>
        </el-row>
    </el-dialog>


</div>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import inline from '../pm/inline'
import VueSanitize from 'vue-sanitize'
import VueMarkdown from 'vue-markdown'
import labelMixin from '../../../mixins/modules/pm/labels.js'
import dateMixin from '../../../mixins/modules/pm/date.js'
import attachementMixin from '../../../mixins/modules/pm/attachment.js'
import checlistMixin from '../../../mixins/modules/pm/checklist.js'
import { mapGetters } from 'vuex'
import checklist from '../pm/checklist'
import comment from '../pm/comment'
import members from '../pm/members'

let defaultOptions = {
  allowedTags: [
    'a',
    'b',
    'img',
    'i',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p'
  ],
  allowedAttributes: {
    a: ['href'],
    img: ['src', 'class', 'alt']
  }
}

Vue.use(VueSanitize, defaultOptions)

export default {
  name: 'pmlists',
  data () {
    return {
      backendUrl: '',
      attachmentPath: this.$BaseUrl + '/storage/',
      listItems: [],
      current: null,
      showAddTask: false,
      newTask: '',
      currentList: 0,
      editTask: false,
      currentTask: {},
      taskEditDescription: false,
      colors: [],
      boardLabels: [],
      updateLabels: false,
      selectedLabel: null,
      fileList: [],
      newChecklist: {},
      showRemoveTask: false,
      newComment: '',
      events: {
        loadTaskLabels: (data, self) => {
          self.colors = data.data.colors
          self.boardLabels = data.data.boards
        },
        refreshLabel: (data, self) => {
          self.currentTask = data.data.task
          if (data.data.colors) {
            self.colors = data.data.colors
            self.boardLabels = data.data.boards
          }
          self.loadLists()
        },
        saveLabel: (data, self) => {
          self.colors = data.data.colors
          self.boardLabels = data.data.boards
          if (data.data.task) {
            self.currentTask = data.data.task
          }
          self.loadLists()
        },
        addChecklistItem: (data, self) => {
          self.currentTask = data.data
        },
        addChecklist: (data, self) => {
          self.currentTask = data.data
        },
        removeTask: (data, self) => {
          if (parseInt(self.currentTask.id) === parseInt(data.data.task.id)) {
            self.editTask = false
            self.showRemoveTask = false
          }
        },
        removeList: (data, self) => {
          self.loadLists()
        }
      }
    }
  },
  components: {
    VueMarkdown,
    draggable,
    inline,
    checklist,
    comment,
    members
  },
  mixins: [labelMixin, dateMixin, attachementMixin, checlistMixin],
  computed: {
    getBoard: function () {
      return this.board
    },
    getLists: {
      get () {
        this.listItems = this.value
        return this.listItems
      },
      set (val) {
        this.listItems = val
        this.$emit('change', this.listItems)
      }
    },
    ...mapGetters(['getToken'])
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    board: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  sockets: {
    disconnect: function () {},
    message: function (msg) {
      // call function on message
      if (this.events && this.events[msg.event]) {
        this.events[msg.event](msg, this)
      }
    }
  },
  methods: {
    removeList (id) {
      let request = {
        event: 'removeList',
        data: {
          id: id
        }
      }

      this.$socket.json.send(request)
    },
    cancelRemove () {
      this.showRemoveTask = false
    },
    removeTask () {
      let request = {
        event: 'removeTask',
        data: {
          id: this.currentTask.id ? this.currentTask.id : 0
        }
      }

      this.$socket.json.send(request)
    },
    // update checklist title
    updateChecklistTitle (element) {
      let request = {
        event: 'updateChecklisTitle',
        data: {
          title: element.title,
          id: element.id
        }
      }

      this.$socket.json.send(request)
    },
    // on task dialog close
    closeTaskModal () {
      this.loadLists()
    },
    handlePreview () {},
    handleRemove () {},
    sanitize (message) {
      if (typeof message === 'undefined') {
        return ''
      } else {
        let html = this.$sanitize(message)
        return html
      }
    },
    // load lists for current selected board
    loadLists () {
      let data = {
        event: 'loadBoardLists',
        data: {
          board: this.getBoard.id
        }
      }

      // send loadBoardLists to ws
      this.$socket.json.send(data)
    },
    showTaskUpdateDescription () {
      if (this.taskEditDescription) {
        this.taskEditDescription = false
      } else {
        this.taskEditDescription = true
      }
    },
    showInsert (list) {
      this.currentList = list
      this.$prompt(Vue.i18n.translate('task_title'), Vue.i18n.translate('new_task'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      })
        .then(value => {
          this.addTask(value)
        })
        .catch(() => {
          // cancel
        })
    },
    showAddLists () {
      this.$prompt(Vue.i18n.translate('list_title'), Vue.i18n.translate('new_list'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      })
        .then(value => {
          this.addList(value, this.getBoard)
        })
        .catch(() => {
          // cancel
        })
    },
    addList (value, board) {
      if (board && board.id && board.id === 0) {
        return false
      }

      let data = {
        event: 'storeList',
        data: {
          title: value.value,
          board: board.id ? board.id : 0
        }
      }

      this.$socket.json.send(data)
    },
    updateListTitle () {
      let data = {
        event: 'updateListTitle',
        data: {
          id: this.current.id,
          title: this.current.title
        }
      }

      this.$socket.json.send(data)
    },
    drag (event) {
      // calculate order
      let data = {
        event: 'dropEvent',
        data: {
          index: event.newIndex,
          list: event.to.id,
          task: event.clone.id
        }
      }

      this.$socket.json.send(data)
      let lists = this.getLists.find(function (obj) {
        return obj.id === parseInt(event.to.id)
      })
      if (lists) {
        this.orderEventsInList(lists.tasks)
      }
    },
    orderEventsInList (list) {
      let tasks = list

      let data = {
        event: 'updateEventsOrder',
        data: {
          tasks: tasks,
          board: this.getBoard
        }
      }

      this.$socket.json.send(data)
    },
    // set current list
    setCurrent (element) {
      this.current = element
    },
    addTask (value) {
      let data = {
        event: 'storeTask',
        data: {
          list: this.currentList,
          title: value.value
        }
      }

      this.$socket.json.send(data)
    },
    // display update form
    updateTask (task) {
      this.editTask = true
      this.currentTask = task
    },
    // Update task title
    updateTaskTitle (value) {
      let data = {
        event: 'updateTaskTitle',
        data: {
          task: this.currentTask.id,
          value: this.currentTask.title
        }
      }

      this.$socket.json.send(data)
    },
    // Save / Update task description
    saveTaskDescription () {
      if (!this.currentTask.description) {
        this.showTaskUpdateDescription()
        return false
      }

      let data = {
        event: 'updateTaskDescription',
        data: {
          task: this.currentTask.id,
          value: this.currentTask.description
        }
      }

      // send data
      this.$socket.json.send(data)
      this.showTaskUpdateDescription()
    }
  },
  created () {
    this.backendUrl = this.$BaseUrl
    // for compatibility between localhost and production
    if (location.protocol === 'http:') { this.attachmentPath = this.attachmentPath.replace('/backend', '') }
    this.listItems = this.value
  }
}
</script>


<style scoped>
/* Comments */

/* End Comments */


.update-labels span {
  display: block;
  height: 28px;
  border-radius: 4px;
  width: 100%;
}

.update-labels button {
  float: right;
  margin-top: 5px;
}

.mod-clickable {
  cursor: pointer;
}

.board-canvas {
  text-align: initial;
  position: relative;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  display: block;
  height: 80vh;
}

.list-container {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  white-space: nowrap;
  margin-bottom: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.list {
  background: #edeff0;
  border-radius: 3px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  max-height: 100%;
  position: relative;
  white-space: normal;
}

.list-wrapper:first-child {
  margin-left: 10px;
}

.list-wrapper {
  width: 270px;
  margin: 0 5px;
  height: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
}

.list-cards {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  margin-bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0 4px;
  padding: 0 4px;
  z-index: 1;
  min-height: 20px;
}

.list-card-title {
  clear: both;
  display: block;
  margin: 0 0 4px;
  overflow: hidden;
  text-decoration: none;
  word-wrap: break-word;
  color: #4d4d4d;
}

.add-list {
  background: rgba(0, 0, 0, 0.12);
  cursor: pointer;
  color: #fff;
  height: auto;
  min-height: 30px;
  padding-top: 10px;
  padding-left: 10px;
  border-radius: 3px;
  -webkit-transition: background 85ms ease-in, opacity 40ms ease-in,
    border-color 85ms ease-in;
  transition: background 85ms ease-in, opacity 40ms ease-in,
    border-color 85ms ease-in;
}

.add-list:hover {
  background: rgba(25, 25, 25, 0.5);
}

.list-wrapper.add {
  height: auto;
}

.list-title {
  padding: 10px;
}

.add-card {
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

.add-card:hover {
  background: #cdd2d4;
}

/* Tasks*/

.task-card {
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  display: block;
  margin-bottom: 6px;
  max-width: 300px;
  min-height: 20px;
  position: relative;
  text-decoration: none;
  z-index: 0;
}

.list-card-details {
  overflow: hidden;
  padding: 6px 6px 2px 8px;
  position: relative;
  z-index: 10;
}

.list-card-labels {
  margin: 2px 0;
  overflow: auto;
  position: relative;
}

.card-label {
  text-shadow: -1px -1px 2px rgba(150, 150, 150, 1);
  background-color: #b6bbbf;
  border-radius: 3px;
  color: #fff;
  display: block;
  margin-right: 3px;
  max-width: 100%;
  overflow: hidden;
  padding: 3px 6px;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.card-label.mod-card-front {
  float: left;
  font-size: 12px;
  font-weight: 600;
  height: 8px;
  line-height: 100px;
  margin: 0 3px 3px 0;
  max-width: 42px;
  min-width: 42px;
  padding: 0;
  text-shadow: none;
  width: auto;
}

.card-label-red {
  background-color: #eb5a46;
}

.list-card.is-covered .list-card-cover {
  border-radius: 3px 3px 0 0;
}

.list-card-cover {
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.main-card-container {
  text-align: initial;
}

.card-title {
  font-size: 18px;
  margin: 0 0 9px;
  color: #333;
}


.task-from-list span {
  text-decoration: underline;
  font-weight: bold;
}

.sidebar-head h2 {
  font-size: 18px;
  margin: 0 0 9px;
  color: #333;
}

.sidebar-menu .menu-btn {
  background: #e2e4e6;
  -webkit-box-shadow: 0 1px 0 0 #c4c9cc;
  box-shadow: 0 1px 0 0 #c4c9cc;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  height: 32px;
  margin-top: 8px;
  max-width: 300px;
  overflow: hidden;
  padding: 7px 7px 7px 11px;
  position: relative;
  text-decoration: none;
  text-overflow: ellipsis;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  white-space: nowrap;
  font-weight: 700;
  border-radius: 3px;
}

.card-label.mod-card-detail {
  border-radius: 3px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: block;
  float: left;
  font-size: 12px;
  font-weight: 600;
  height: 30px;
  line-height: 30px;
  margin: 0 4px 4px 0;
  min-width: 40px;
  padding: 0 8px;
  width: auto;
}

.card-label.mod-card-detail:hover {
  opacity: 0.8;
}

.sidebar-menu .menu-btn:hover {
  background: #cdd2d4;
  -webkit-box-shadow: 0 1px 0 0 #a5acb0;
  box-shadow: 0 1px 0 0 #a5acb0;
  color: #4c4c4c;
}

.task-description-container span {
  cursor: pointer;
  text-decoration: underline;
}

.task-description-container p {
  -webkit-margin-before: 0px;
}

.task-detail-item-header {
  color: #838c91;
  display: block;
  font-weight: 400;
  font-size: 14px;
  margin: 0 8px 8px 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.label-list i {
  float: right;
  line-height: 30px;
}

.date-container {
  cursor: pointer;
}

/*Attachements*/

.attachment-thumbnail {
  border-radius: 3px;
  min-height: 80px;
  margin: 0 0 8px;
  overflow: hidden;
  position: relative;
}

.attachment-thumbnail-preview {
  border: 1px solid #d6dadc;
  background-color: #e2e4e6;
  background-position: 50%;
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 3px;
  height: 78px;
  margin-top: -40px;
  position: absolute;
  top: 50%;
  left: 0;
  text-align: center;
  text-decoration: none;
  z-index: 0;
  width: 108px;
}

.attachment-thumbnail-details {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  padding: 8px 8px 8px 120px;
  min-height: 80px;
  margin: 0;
}

.attachment-thumbnail-details .attachment-thumbnail-name {
  font-weight: 700;
  line-height: 20px;
  padding: 2px 0;
  word-wrap: break-word;
}

.quiet,
.quiet a {
  color: #838c91;
}

.attachment-thumbnail-name .inline-container {
  padding-left: 0px;
}

/*Checklist*/

.checklistContainer label {
  font-weight: 700;
  display: block;
}

.checklistContainer button {
  margin-top: 10px;
}

.menu-btn.remove-btn{
  background: rgb(217, 73, 89);
  color:#fff;
}

.full-width-btn{
  width: 100%;
}
</style>
