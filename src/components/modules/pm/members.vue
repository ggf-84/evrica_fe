<template>
  <div class="members-list">

    <div>
      <h4>{{$t('search_members')}}:</h4>
      <el-input size="mini" v-model="searchMember" @input="searchUser" :placeholder="$t('search_members')"></el-input>
        <ul>
          <li v-for="item in result" @click="checkMember(item.id)" :key="item.id">
            <span >{{item.firstname}} {{item.lastname}}</span>
          </li>
        </ul>
    </div>

    <div>
      <h4>{{$t('selected_members')}}:</h4>
      <ul>
        <li v-for="member in members" :key="member.id" @click="checkMember(member.user.id)">
          <span class="member-item">  {{member.user.firstname}} {{member.user.lastname}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'members',
  data () {
    return {
      members: [],
      events: {
        getTaskMembers: (data, self) => {
          self.members = data.data.users
        },
        searchTaskMember: (data, self) => {
          self.showResult = true
          self.result = data.data.users
        },
        checkTaskMember: (data, self) => {
          self.getTaskMembers()
        }
      },
      searchMember: '',
      result: [],
      showResult: false
    }
  },
  methods: {
    searchUser () {
      if (this.searchMember.length > 0) {
        let request = {
          event: 'searchTaskMember',
          data: {
            task: this.getTask.id,
            term: this.searchMember
          }
        }

        this.$socket.json.send(request)
      } else {
        this.showResult = false
        this.result = []
      }
    },
    checkMember (client) {
      let request = {
        event: 'checkTaskMember',
        data: {
          task: this.getTask.id,
          user: client
        }
      }

      this.$socket.json.send(request)
    },
    getTaskMembers () {
      let request = {
        event: 'getTaskMembers',
        data: {
          task: this.getTask.id
        }
      }

      this.$socket.json.send(request)
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
  props: {
    task: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    getTask () {
      return this.task
    }
  },
  created () {
    // get selected user
    this.getTaskMembers()
  }
}
</script>
<style scoped>
.btn-search-members-task{
  margin-top:10px;
}
.members-list li {
  list-style: none;
  cursor: pointer;
  padding-top: 10px;
  padding-bottom: 5px;
}

.members-list ul {
  padding-left: 0px;
}
.members-list li {
  border-radius: 3px;
  padding-left: 10px;
  padding-bottom: 10px;
}
.members-list li:hover {
  background: #298fca;
  color: #fff;
}
</style>

