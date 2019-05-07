<template>
<el-col :xs="24">
<el-col :xs="24">

    <div class="window-module add-comment-section">
        <div class="window-module-title window-module-title-no-divider">
            <h3><i class="el-icon-tickets"></i> {{$t('add_comment')}}</h3>
            <span class="editing-members js-editing-members hide"></span>
        </div>
        <div class="new-comment js-new-comment">
            <div class="member member-no-menu">
            </div>
            <div class="comment-frame">
                <div class="comment-box">

                    <el-input type="textarea" class="comment-box-input js-new-comment-input" :rows="4" resize="vertical" placeholder="Write a comment..." v-model="newComment">
                    </el-input>

                </div>
            </div>
            <div class="comment-controls u-clearfix">
                <el-button style="margin-top:10px;" @click="storeComments" size="mini" :type="newComment.length === 0?'default':'success'" :disabled="newComment.length === 0?true:false">{{$t('save')}}</el-button>
            </div>

        </div>
    </div>

</el-col>

<!-- Comment List-->
<el-col :xs="24" class="comments-container" >
    <h2>{{$t('comments')}}</h2>
    <el-col :xs="24" v-loading="loading" ref="comments"  class="comment-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" >
        <div class="comment-item" v-for="comment in comments" :key="comment.id">
            <div class="comment-head"><span>{{comment.user.firstname}} {{comment.user.lastname}}</span> {{localeTime(comment.updated_at)}}</div>
            <div class="comment-content">
                <vue-markdown v-if="!inUpdate || comment.id !== selectedComment.id" :source="sanitize(comment.text)"></vue-markdown>
                  <!-- Update comment form-->
                <el-col :xs="24" v-if="inUpdate && comment.id === selectedComment.id">
                  <el-input type="textarea"  class="comment-box-input js-new-comment-input" :rows="4" resize="vertical" placeholder="Write a comment..." v-model="updateComment"/>
                  <el-col :xs="24" class="button-group">
                    <el-button size="mini" type="success" @click="update">{{$t('update')}}</el-button>
                    <el-button size="mini" @click="inUpdate = false">X</el-button>
                  </el-col>
                </el-col>
            </div>
            <div class="comment-actions" v-if="!inUpdate && getUser.id === comment.user_id">
                <el-button type="text" @click="showUpdate(comment)">{{$t('edit')}}</el-button> -

                <el-popover v-bind:key="comment.id"  placement="top" width="160" v-model="removeConfirmation[comment.id]">
                    <p>{{$t('are_you_sure_to_delete_this')}}?</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="removeConfirmation[comment.id] = false">{{$t('cancel')}}</el-button>
                      <el-button type="primary" size="mini" @click="remove">{{$t('confirm')}}</el-button>
                    </div>
                    <el-button type="text" @click="showRemove(comment)" slot="reference">{{$t('delete')}}</el-button>
                </el-popover>
            </div>
        </div>
    </el-col>
</el-col>
</el-col>

</template>

<script>
import Vue from 'vue'
import infiniteScroll from 'vue-infinite-scroll'
import VueSanitize from 'vue-sanitize'
import VueMarkdown from 'vue-markdown'
import moment from 'moment'
import momentTz from 'moment-timezone'

import { mapGetters } from 'vuex'

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
  name: 'Comment',
  directives: {
    infiniteScroll
  },
  data () {
    return {
      removeConfirmation: [],
      inUpdate: false,
      busy: false,
      loading: false,
      page: 1,
      comments: [],
      newComment: '',
      updateComment: '',
      selectedComment: {},
      timer: null,
      load: {},
      events: {
        getComments: (data, self) => {
          var container = document.querySelector('.comment-list')
          var height = container.scrollHeight
          height = height - 70 / height * 100

          if (parseInt(data.data.page) === 1) {
            self.comments = data.data.comments
            // container.scrollTop = height
          } else {
            self.comments = self.comments.concat(data.data.comments)
            container.scrollTop = height
          }

          if (data.data.comments.length > 0) {
            self.busy = false
          }
        },
        storeComment: (data, self) => {
          self.newComment = ''
          self.comments.unshift(data.data)
        }
      }
    }
  },
  components: {
    VueSanitize,
    VueMarkdown,
    infiniteScroll
  },
  computed: {
    getTask () {
      return this.task
    },
    ...mapGetters(['getUser'])
  },
  props: {
    task: {
      value: Number,
      default: () => {
        return 0
      }
    }
  },
  methods: {
    remove: function () {
      let request = {
        event: 'removeComment',
        data: {
          id: this.selectedComment.id
        }
      }

      this.$socket.json.send(request)
      var self = this
      setTimeout(() => {
        self.page = 1
        self.getComments(1)
      }, 200)
    },
    showRemove: function (comment) {
      this.selectedComment = comment
      this.removeConfirmation[comment.id] = true
    },
    update: function () {
      let request = {
        event: 'updateComment',
        data: {
          id: this.selectedComment.id,
          content: this.updateComment
        }
      }

      this.$socket.json.send(request)
      // set new value & close update
      this.selectedComment.text = this.updateComment
      this.inUpdate = false
    },
    showUpdate: function (comment) {
      this.selectedComment = comment
      this.inUpdate = true
      this.updateComment = this.selectedComment.text
    },
    loadMore: function (data) {
      if (this.comments.length === 0) {
        return false
      }
      var self = this
      self.busy = true

      this.load = this.$loading({
        lock: true,
        target: '.comments-container'
      })

      clearTimeout(self.timer)

      self.timer = setTimeout(function () {
        self.page = self.page + 1
        self.getComments(self.page)

        var container = document.querySelector('.comment-list')
        var height = container.clientHeight
        container.style.height = height + 200

        self.load.close()
      }, 100)
    },
    moment: function (date) {
      return moment(date)
    },
    localeTime: function (timestamp) {
      let offset, localText, momentTime, createdDate, utcTime
      offset = this.moment().utcOffset()
      utcTime = timestamp
      localText = moment
        .utc(utcTime)
        .utcOffset(offset)
        .format()
      momentTime = momentTz.tz(localText, this.timezone).format()
      createdDate = this.moment(momentTime).fromNow()
      return createdDate
    },
    storeComments: function () {
      let request = {
        event: 'storeComment',
        data: {
          content: this.newComment,
          task: this.getTask,
          user: this.getUser ? this.getUser.id : 0
        }
      }

      this.$socket.json.send(request)
    },
    getComments: function (page = 1) {
      let request = {
        event: 'getComments',
        data: {
          task: this.getTask,
          page: page
        }
      }

      this.$socket.json.send(request)
    },
    sanitize (message) {
      if (typeof message === 'undefined') {
        return ''
      } else {
        let html = this.$sanitize(message)
        return html
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
  created () {
    console.log(this.getUser)
    this.getComments()
  }
}
</script>
<style scoped>
.comment-item .comment-head span {
  font-weight: bold;
}
.button-group{
  margin-top:10px;
}
.comment-item {
  padding: 10px;
  margin-bottom: 40px;
  border-bottom: 1px solid lightgrey;
}
.comment-content {
  background-color: #fff;
  border-radius: 3px;
  -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.23);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.23);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  clear: both;
  display: inline-block;
  margin: 6px 2px 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  padding: 10px;
}
.comment-list {
  max-height: 400px;
  min-height: 400px;
  overflow-y: scroll;
  margin-top: 20px;
}
</style>
