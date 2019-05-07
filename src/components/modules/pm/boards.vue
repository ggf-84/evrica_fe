<template>
<div class="list-boards">
  <div>
  <el-row :gutter="20">

      <!-- Pm teams header-->
      <div class="pm-teams-header">
        <h4>{{$t('personal_boards')}}</h4>
      </div>
      <!-- End PM teams header-->

      <!-- Boards list-->
      <div class="boards">
        <el-col  :xs="24" :sm="6" :md="4" :lg="4" :xl="4" v-for="(board, indx) in returnItems.default" :key="indx" >
          <div class="board-item-list" @click="selectBoard(board)">{{board.title}}</div>
        </el-col>
        <el-col  :xs="24" :sm="6" :md="4" :lg="4" :xl="4" >
          <div class="board-add-item" @click="showAddBoard('default',0)">{{$t('add_new_board')}}</div>
        </el-col>
      </div>
      <!-- End boards list -->
  </el-row>




  <el-row :gutter="20" v-for="(team, key) in returnItems.teams" :key="key">

      <!-- Pm teams header-->
      <div class="pm-teams-header">
        <h4>{{team.title}}

          <!-- Members popover-->
          <el-popover placement="bottom" width="200" trigger="click" :key="team.id">

            <el-col :xs="24">
              <p>{{$t('add_users_to_team')}}</p>
              <el-input size="mini" :placeholder="$t('search_users')" v-model="searchUsersTerm"></el-input>
              <el-button type="success" @click="searchTeamUsers(team)" class="search-btn" size="mini">{{$t('search')}}</el-button>
              <el-button size="mini" @click="resetPopover()">X</el-button>
            </el-col>

            <!-- List of search results with users -->
            <el-col :xs="24" v-if="showSearchResult">
              <div class="users-search-results" >
                <div class="users-search-item" v-for="(user, i) in searchUserResult" @click="selectTeamUser(team,user)" :key="i">
                  <i v-if="user.in_team.length > 0" class="el-icon-check"></i>
                  {{user.firstname}} {{user.lastname}}
                </div>
              </div>
            </el-col>


            <!-- list of selected users-->
            <el-col :xs="24" v-if="!showSearchResult">
              <div class="selected-user-list" v-if="team.members && team.members.length > 0">
                <div class="selected-user-item" v-for="(user, ind) in team.members" :key="ind" @click="selectTeamUser(team,user)">
                   <i class="el-icon-check"></i> {{user.firstname}} {{user.lastname}}
                </div>
              </div>
            </el-col>


            <el-button slot="reference" size="mini" @click="resetPopover(team)"  icon="el-icon-tickets">{{$t('members')}}</el-button>
          </el-popover>

          <!-- End team popover-->

          <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeTeam(team.id)">Remove Team</el-button>

        </h4>

      </div>
      <!-- End PM teams header-->

      <!-- Boards list-->
      <div class="boards">
        <el-col  :xs="24" :sm="6" :md="4" :lg="4" :xl="4" v-for="(board, indx) in team.boards" :key="indx" >
          <div class="board-item-list" @click="selectBoard(board)">{{board.title}}</div>
        </el-col>
        <el-col  :xs="24" :sm="6" :md="4" :lg="4" :xl="4" >
          <div class="board-add-item" @click="showAddBoard('teams',key)">{{$t('add_new_board')}}</div>
        </el-col>
      </div>
      <!-- End boards list -->
  </el-row>

  <div class="clear-fix"></div>

  <span class="add-team" @click="showAddTeam">{{$t('add_new_team')}}...</span>


</div>
</div>
</template>
<script>
import { Button, ButtonGroup } from 'element-ui'
import Vue from 'vue'

export default {
  name: 'pmboards',
  data () {
    return {
      lists: [],
      sel: 0,
      boards: [],
      loaded: false,
      currentTeam: 0,
      searchUsersTerm: '',
      showSearchResult: false,
      selectedTeam: {},
      searchUserResult: [],
      events: {
        searchTeamUsers: (data, self) => {
          self.showSearchResult = true
          self.searchUserResult = data.data
        },
        selectTeamUser: (data, self) => {
          if (self.showSearchResult && self.selectedTeam.id) {
            self.searchTeamUsers(self.selectedTeam)
            self.getBoards()
          } else {
            self.getBoards()
          }
        }
      }
    }
  },
  computed: {
    returnItems: {
      get () {
        this.lists = this.items
        return this.lists
      },
      set (val) {
        this.lists = val
        this.$emit('change', this.lists)
      }
    },
    selectedItem: {
      get () {
        this.sel = this.selected
        return this.sel
      },
      set (val) {
        this.selected.id = val.id
        this.selected.title = val.title
        this.$emit('select', this.selected)
      }
    }
  },
  props: {
    selected: {
      type: Object,
      default: () => {
        return {}
      }
    },
    items: {}
  },
  components: {
    Button,
    ButtonGroup
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
    removeTeam (team) {
      let request = {
        event: 'removeTeam',
        data: {
          id: team
        }
      }

      this.$socket.json.send(request)
    },
    getBoards () {
      // send event getBoards to ws
      let data = { event: 'getBoards', data: {} }
      this.$socket.json.send(data)
    },
    selectTeamUser (team, user) {
      let request = {
        event: 'selectTeamUser',
        data: {
          team: team.id ? team.id : 0,
          user: user.id ? user.id : 0
        }
      }

      this.$socket.json.send(request)
    },
    resetPopover (team) {
      this.selectedTeam = team
      this.searchUsersTerm = ''
      this.showSearchResult = false
      this.searchUserResult = []
    },
    searchTeamUsers (team) {
      this.selectedTeam = team

      let request = {
        event: 'searchTeamUsers',
        data: {
          term: this.searchUsersTerm,
          team: this.selectedTeam.id
        }
      }

      this.$socket.json.send(request)
    },
    showAddBoard (type, indx) {
      this.$prompt(Vue.i18n.translate('board_title'), Vue.i18n.translate('new_board'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      })
        .then(value => {
          this.addBoard(value, type, indx)
        })
        .catch(() => {
          // cancel
        })
    },
    showAddTeam () {
      this.$prompt(Vue.i18n.translate('team_title'), Vue.i18n.translate('new_team'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      })
        .then(value => {
          this.addTeam(value)
        })
        .catch(() => {
          // cancel
        })
    },
    addBoard (value, type, indx) {
      // check type of collection of boards
      if (type !== 'default') {
        this.items[type][indx].boards.push({ title: value.value })
      } else {
        // add to local default list of boards
        this.items[type].push({ title: value.value })
      }

      if (this.items[type][indx] && type !== 'default') {
        this.currentTeam = this.items[type][indx].id
      } else {
        this.currentTeam = 0
      }

      this.storeBoard(value)
    },
    storeBoard (value) {
      let data = {
        event: 'storeBoard',
        data: {
          title: value.value ? value.value : 'Unknown Board',
          team: this.currentTeam
        }
      }
      this.$socket.json.send(data)
      this.currentTeam = 0
    },
    addTeam (value) {
      // Todo validation for input team title
      if (value.value) {
        this.items['teams'].push({ title: value.value, boards: [] })
        this.storeTeam(value.value)
      }
    },
    storeTeam (title) {
      let data = { event: 'storeTeam', data: { title: title } }
      this.$socket.json.send(data)
    },
    selectBoard (board) {
      this.selectedItem = { id: board.id, title: board.title }
      this.$emit('clicked')
    }
  }
}
</script>
<style scoped>
.users-search-item:hover {
  background-color: #b4b4b4;
  color: #fff;
}
.users-search-item {
  cursor: pointer;
}
.users-search-results {
  margin-top: 10px;
  max-height: 200px;
  overflow-y: scroll;
}
.selected-user-list {
  margin-top: 10px;
}
.selected-user-item {
  margin-bottom: 5px;
}
.selected-user-item:hover {
  text-decoration: underline;
  cursor: pointer;
}
.search-btn {
  margin-top: 5px;
}
.clear-fix {
  width: 100%;
  height: 25px;
  display: block;
}
.pm-teams-header {
  padding-left: 10px;
}
.add-team {
  color: #838c91;
  padding: 10px 10px 10px 5px;
  text-decoration: underline;
  width: 150px;
}
.add-team:hover {
  cursor: pointer;
  background-color: #d1d6d8;
}
.list-boards {
  text-align: initial;
}
.board-item-list {
  cursor: pointer;
  height: 80px;
  background-color: rgb(0, 121, 191);
  border-radius: 3px;
  display: block;
  background-size: cover;
  background-position: 50%;
  color: #fff;
  line-height: 20px;
  margin: 0 8px 8px 0;
  padding: 8px;
  position: relative;
  text-decoration: none;
}

.board-add-item {
  background-color: #e2e4e6;
  color: #838c91;
  display: table-cell;
  height: 96px;
  font-weight: 500;
  text-align: center;
  vertical-align: middle;
  width: inherit;
  cursor: pointer;
}
</style>
