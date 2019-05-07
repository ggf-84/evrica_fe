<template>
<el-main>
    <!-- Board List -->
    <pmboards
        :items="teams"
        v-if="showBoards"
        :selected="selected"
        @clicked="onSelectBoard()"
    />

    <el-row v-if="showLists">

        <el-row>
        <el-col :md="2">
           <span
                class="back-navigation"
                @click="backFromLists"
            ><i class="el-icon-arrow-left"></i>{{$t('back')}}</span>
        </el-col>
        </el-row>

  <el-row>
        <inline
            v-model="selected.title"
            @change="updateBoardTitle"
        />

        <el-button style="float:right;" size="mini" @click="removeBoard(selected.id)" icon="el-icon-delete">Remove board</el-button>
  </el-row>

    </el-row>

    <pmlists
        v-model="lists"
        :board="selected"
        @change="loadLists()"
        v-if="showLists"
    />

</el-main>
</template>

<script>
import pmboards from '../modules/pm/boards.vue'
import pmlists from '../modules/pm/lists.vue'
import inline from '../modules/pm/inline.vue'
import { mapGetters } from 'vuex'
import Vue from 'vue'

export default {
  name: 'PM',
  components: {
    pmboards,
    pmlists,
    inline
  },
  computed: {
    ...mapGetters(['getLanguage'])
  },
  data () {
    return {
      // show Lists
      showLists: false,
      // show Boards
      showBoards: true,
      // selected board
      selected: {
        id: 0,
        edit: false
      },
      // teams list
      teams: [
        {
          id: 3,
          title: '',
          boards: []
        },
        {
          id: 1,
          title: '',
          boards: []
        }
      ],
      lists: [],
      events: {
        getBoards: (data, self) => {
          self.teams = data.data
        },
        loadBoardLists: (data, self) => {
          self.lists = data.data
          this.showBoards = false
          this.showLists = true
        },
        storeTeam: (data, self) => {
          self.getBoards()
        },
        storeBoard: (data, self) => {
          self.getBoards()
        },
        storeList: (data, self) => {
          self.loadLists()
        },
        storeTask: (data, self) => {
          self.loadLists()
        },
        orderEventsInList: (data, self) => {
          self.loadLists()
        },
        geti18n: (data, self) => {
          Vue.i18n.add(data.data.lang, data.data.values)
        },
        removeTask: (data, self) => {
          self.loadLists()
        },
        removeBoard: (data, self) => {
          if (parseInt(self.selected.id) === parseInt(data.data.board.id)) {
            self.backFromLists()
          }
          self.getBoards()
        },
        removeTeam: (data, self) => {
          self.backFromLists()
          self.getBoards()
        }
      }
    }
  },
  methods: {
    removeBoard (board) {
      let request = {
        event: 'removeBoard',
        data: {
          id: board
        }
      }

      this.$socket.json.send(request)
    },
    loadTranslations () {
      let request = {
        event: 'geti18n',
        data: {
          keys: [
            'personal_boards',
            'add_new_task',
            'members',
            'add_new_team',
            'add_new_team',
            'add_new_list',
            'add_new_board',
            'insert_board_title',
            'search_users',
            'add_users_to_team',
            'search',
            'new_board',
            'board_title',
            'new_team',
            'team_title',
            'add_task',
            'back',
            'new_task',
            'task_title',
            'add_list',
            'new_list',
            'list_title',
            'add',
            'in_list',
            'description',
            'edit',
            'attachements',
            'add_comment',
            'write_comment',
            'save',
            'comments',
            'labels',
            'checklist',
            'due_date',
            'attachement',
            'search_members',
            'selected_members',
            'title',
            'files_with_a_size_less_than',
            'drop_file_or_click',
            'added',
            'add_an_item',
            'delete',
            'update',
            'are_you_sure_to_delete_this',
            'confirm',
            'cancel',
            'yes',
            'no',
            'remove_task'
          ],
          lang: 'ru,en'
        }
      }

      // set current user language
      if (this.getLanguage) {
        Vue.i18n.set(this.getLanguage.code)
      } else {
        Vue.i18n.set('en')
      }

      Vue.i18n.fallback('en')
      this.$socket.json.send(request)
    },
    backFromLists () {
      this.showBoards = true
      this.showLists = false
      this.selected = {
        id: 0
      }
    },
    onSelectBoard () {
      this.loadLists()
    },
    getBoards () {
      // send event getBoards to ws
      let data = {
        event: 'getBoards',
        data: {}
      }
      this.$socket.json.send(data)
    },
    // load lists for current selected board
    loadLists () {
      if (this.selected && this.selected.id && this.selected.id === 0) {
        return null
      }

      let data = {
        event: 'loadBoardLists',
        data: {
          board: this.selected.id
        }
      }

      // send loadBoardLists to ws
      this.$socket.json.send(data)
    },
    // update board title
    updateBoardTitle () {
      let data = {
        event: 'updateBoardTitle',
        data: {
          id: this.selected.id,
          title: this.selected.title
        }
      }

      this.$socket.json.send(data)
      this.getBoards()
    },
    toggleEditBoardTitle (el, selected) {
      this.selected.edit = !selected.edit
      var self = this
      if (selected.edit) {
        Vue.nextTick(function () {
          self.$refs.input.focus()
        })
      }
    },
    saveEditBoardTitle (el, selected) {
      this.selected.edit = false
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
  created () {
    // get teams & boards from server
    this.getBoards()

    // load translations
    this.loadTranslations()
  }
}
</script>

<style scoped>
.back-navigation {
  float: left;
  margin-bottom: 20px;
  font-weight: bold;
  color: #838c91;
  cursor: pointer;
  text-align: left;
}

.back-navigation:hover {
  font-weight: bold;
  font-size: 20pt;
}
</style>
