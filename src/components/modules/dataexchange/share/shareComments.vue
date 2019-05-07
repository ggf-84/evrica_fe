<template>
<div>

    <!-- input and user header  -->
    <div>
      <div class="current-user-data">
        <div class="containerDE">
          <!-- Single Media Object -->
          <div class="mediaDE">
            <img class="mediaDE-figure user-avatar" src="http://qnimate.com/wp-content/uploads/2014/03/images2.jpg">
            <div class="mediaDE-body">
              <h5 class="DE-dblock">{{getUser.firstname}} {{getUser.lastname}}</h5>
              <p class="DE-dblock">{{getUser.email}}</p>
            </div>
          </div>
        </div>
      </div>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="Type in a new comment"
        v-model="commentInput">
      </el-input>
       <el-button class="btn-post-comment" @click="postItemComment()">Add</el-button>
    </div>
    <!-- end input and user header -->

    <!-- loader -->
    <loader :loading="dataIsLoading" class="loader-comments"></loader>
    <!-- end loader -->

    <!-- comments list  -->
    <div class="commentsDE-section">
      <div class="title-section">
        <b>Comments:</b>
      </div>
      <div v-if="parseInt(returnComments.length) === 0">No comments available</div>
      <div v-else>
          <div class="commentsDE-containerDE" ref="commentsContainer">
            <div v-for="(dataMessage, indx) in returnComments" :key="indx">
                <div v-if="dataMessage.user !== null">
                  <div class="containerDE">
                    <!-- Single Media Object -->
                    <div class="mediaDE">
                      <img class="mediaDE-figure user-avatar" src="http://qnimate.com/wp-content/uploads/2014/03/images2.jpg">
                      <div class="mediaDE-body">
                        <h5 class="DE-dblock">{{dataMessage.user.firstname}} {{dataMessage.user.lastname}} * <span>{{localeTime(dataMessage.created_at)}}</span></h5>
                        <p class="DE-dblock">{{dataMessage.message}}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="dataMessage.counterparty !== null">No counterparty</div>
            </div>
          </div>
      </div>
    </div>
    <!-- end comments list -->
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import dataMixin from '../../../../mixins/modules/dataexchange/dataModifier.js'
import loader from '../loading.vue'
import notification from '../../../../mixins/modules/notifications/notification'
import { EventBus } from '../../../../mixins/modules/dataexchange/eventBus'

export default {
  data () {
    return {
      dataComments: [],
      dataItem: {},
      dataIsLoading: false,
      commentInput: '',
      lastScrollComments: false,
      pageHeightComments: 0,
      commentsBottom: false,
      currentCommentsPage: 1
    }
  },
  mixins: [
    dataMixin
  ],
  computed: {
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
    ...mapGetters(['getToken', 'getUser', 'getCurrentItem'])
  },
  props: {
    comments: {
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
    },
    loadComments: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  components: {
    loader
  },
  watch: {
    getCurrentItem: function (val) {
      this.currentCommentsPage = 1
    }
  },
  updated () {
    var self = this
    // listen scroll rooms
    let windowComments = this.$refs.commentsContainer
    if (windowComments) {
      windowComments.addEventListener('scroll', () => {
        this.commentsBottom = this.bottomCommentsVisible()
        if (this.commentsBottom) {
          this.currentCommentsPage++
          this.$emit('loadComments', {page: this.currentCommentsPage, item: self.returnItem})
          this.$nextTick(function () {
            let containerDE = self.$refs.commentsContainer
            containerDE.scrollTo(0, self.pageHeightComments)
          })
        }
      })
    }
  },
  mounted () {
    EventBus.$on('showLoadingComments', data => {
      this.dataIsLoading = data
    })
  },
  created () {
  },
  methods: {
    postItemComment: function () {
      this.commentInput = this.commentInput.trim()
      if (this.commentInput && this.commentInput.length) {
        var self = this
        this.$emit('postItemComment', {item: self.returnItem, comment: self.commentInput})
        this.commentInput = ''
      } else {
        notification.error('System', "Can't send empty message")
      }
    },
    bottomCommentsVisible () {
      let windowComments = this.$refs.commentsContainer
      let scrollY = windowComments.scrollTop
      let visible = windowComments.clientHeight
      let pageHeight = windowComments.scrollHeight
      let bottomOfPage = visible + (scrollY + 10) >= pageHeight

      if (!this.lastScrollComments && bottomOfPage) {
        this.lastScrollComments = true
        this.pageHeightComments = pageHeight
        return true
      } else if (this.lastScrollComments && bottomOfPage) {
        this.lastScrollComments = true
        return false
      } else if (!bottomOfPage) {
        this.lastScrollComments = false
        return false
      }

      return bottomOfPage || pageHeight < visible
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.commentsDE-data-row{
  margin-bottom: 0.5em;
}
.commentsDE-section {
}

.current-user-data{
  margin-bottom: 0.5em;
}

.user-avatar{
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.comment-data {
  position: relative;
top: -1em;
}

.containerDE {
  border-bottom: 1px solid #d1cdcd;
  border-top: 1px solid #d1cdcd;
  padding-top: 1em;
}
.containerDE .mediaDE {
}
.containerDE h5,
.containerDE p {
  margin: 0 0 15px;
}

.containerDE p {
  position: relative;
top: -0.5em;
}
.mediaDE {
  display: flex;
  align-items: flex-start;
}
.mediaDE .mediaDE-figure {
  margin-right: 1em;
}
.mediaDE .mediaDE-body {
  flex: 1;
}

.title-section{
  margin-bottom: 0.5em;
  margin-top: 0.5em;
}

.btn-post-comment{
  margin-top: 0.5em;
}

.commentsDE-containerDE{
  max-height: 300px;
  overflow-x: auto;
  overflow-y: scroll;
}

.loader-comments {
  margin-top: 1em;
  margin-bottom: 1em;
  width: 35px;
  height: 35px;
  margin: 0 auto;
}

.DE-dblock{
  display: block;
}

</style>
