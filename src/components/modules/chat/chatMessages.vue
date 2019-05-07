<template>
<div class="chatMessages">
  <div class="box-top" v-if="model.length >= 1">

    <!-- ############################################################### -->
    <!-- current statuses  -->
    <div v-if="currentRoomData.length !== 0">
      &nbsp;

    <div class="media">
      <div class="media-left">
        <div class="user-pic" :style="{ 'background-image': 'url(' + require('@/assets/group-avatar.png') + ')' }"></div>
      </div>
      <div class="media-body">
        <h4 class="media-heading">{{currentRoomData.title}}</h4>
        <div>created {{localeTime(currentRoomData.created_at)}}</div>
      </div>
    </div>

    </div>
    <div v-else-if="currentUserData.length !== 0">
      &nbsp;

    <div class="media">
      <div class="media-left">
        <div class="user-pic" :style="{ 'background-image': 'url(' + require('@/assets/default.png') + ')' }"></div>
      </div>
      <div class="media-body">
        <h4 class="media-heading">{{currentUserData.firstname}} {{currentUserData.lastname}}</h4>
        <div>{{currentUserData.email}}</div>
      </div>
    </div>

    </div>
    <div v-else-if="currentGuestData.length !== 0">
      &nbsp;

    <div class="media">
      <div class="media-left">
        <div class="user-pic" :style="{ 'background-image': 'url(' + require('@/assets/group-avatar.png') + ')' }"></div>
      </div>
      <div class="media-body">
        <h4 class="media-heading">{{currentGuestData.title}}</h4>
        <div>created {{localeTime(currentGuestData.created_at)}}</div>
      </div>
    </div>

    </div>
    <div v-else>
      Chat is not selected
    </div>
    <div v-if="parseInt(currentRoomID) !== 0 && parseInt(leftRoom) !== 1">
      <span id="idCurrentDate" class="currentTimestamp" @click="dialogVisibleDate = true">{{displayPeriodText}}</span>
    </div>
    &nbsp;
    <!-- end current statuses -->
    <!-- ############################################################### -->

  <!-- <h2>users</h2> -->
  </div>

  <div class="chat main-chat" v-if="loaded" ref="msgcontainer">
    <br>
     <div class="chat-history">
       <br><br>
       <ul v-for='(message, index) in model' :key="index" v-if="tick > -1" style="list-style-type: none;" :data-time="dataTime(message.created_at)" class="message-data-body">

         <!-- timestamp  today Yesterday etc..-->
         <div v-if="hasGroup(message.created_at)">
           <div class="msg-date-separator"><span>{{groupMsg(message.created_at)}}</span></div>
         </div>

         <!-- system message  -->
         <li v-if="parseInt(message.is_notification) === 1">
           <div class="message-data">
             <span class="message-data-name">System</span>
             <span class="message-data-time">{{localeTime(message.created_at)}}</span>
           </div>
           <div class="message my-message">
             <span class="message-text">{{message.parsed}}</span>
           </div>
         </li>

         <!-- current user message -->
         <li class="clearfix" v-else-if="message.user!=null && getUser.id === message.user.id">
           <div class="message-data align-right">
             <span class="message-data-time"><span v-if="parseInt(message.is_edited) === 1">edited * </span> {{localeTime(message.created_at)}}</span>
             <span class="message-data-name">{{message.user.firstname}}</span>
           </div>
           <div class="message other-message float-right">

             <!-- display message -->
             <!-- <span v-html="sanitize(message.parsed)" class="message-text"></span> -->
             <!-- <vue-markdown class="message-text" v-html="sanitize(message.parsed)"></vue-markdown> -->
             <vue-markdown class="message-text" :source="sanitize(message.parsed)"></vue-markdown>
             <!-- url preview -->
             <div v-if="is_url(message.parsed)" style="margin-top:1em">
               <link-prevue :url="message.parsed">
               <template slot-scope="props">
                  <div class="card" style="width: 15rem;">
                    <a :href="props.url" target="_blank" v-if="typeof props.img !== 'undefined'">
                    <div class="card-img-top" :style="{ 'background-image': 'url(' + props.img + ')' }" :alt="props.title"></div>
                  </a>
                  <a :href="props.url" target="_blank" v-else-if="isImg(message.parsed)">
                  <div class="card-img-top" :style="{ 'background-image': 'url(' + message.parsed + ')' }" :alt="props.title"></div>
                </a>
                    <div class="card-block">
                      <div class="card-title">{{props.title}}</div>
                      <div class="link-prev">
                        <p class="card-text">{{props.description}}</p>
                      </div>
                      <div class="link-prev">
                      <a :href="props.url" class="btn btn-primary" target="_blank">More</a>
                      </div>
                    </div>
                  </div>
                </template>
             </link-prevue>
             </div>

             <!-- img or file display -->
              <span v-if="message.files.length >= 1" class="data-files">
                  <span v-for="(file,index) in message.files" :key="index">
                      <div v-if="file.thumbnail !== 'default.png' || file.extension === 'gif'" style="margin-bottom:1em">

                          <a :href="getFileUrl(file.name)" class="ref-link" target="_blank">
                              <div class="thumb-message" :style="{ 'background-image': 'url(' + getFileUrl(file.name) + ')' }" v-if="file.extension === 'gif'"></div>
                              <div class="thumb-message" :style="{ 'background-image': 'url(' + getThumbnailUrl(file.thumbnail) + ')' }" v-else></div>
                          </a>

                          <span class="name-size">

                                  <a :href="getFileDownloadUrl(file.name,file.original_name)" :download="file.original_name" >
                                      <span class="shorten-filename">{{file.original_name}}</span>
                                  </a>


                              {{file.size}}
                          </span>

                      </div>
                      <div v-else>
                          <a :href="getFileDownloadUrl(file.name,file.original_name)" :download="file.original_name" >
                              <span class="shorten-filename">{{file.original_name}}</span>
                          </a>
                          {{file.size}}
                      </div>

                  </span>
              </span>

           </div>
           <div class="edit-delele-message" v-if="checkEditDelete(message.created_at)">
             <span  v-if="parseInt(message.editable) === 1 && message.files.length === 0
             && message.user.id === getUser.id
             " @click="editMessage(message)">
             <el-tooltip class="item" effect="dark" content="Edit message" placement="top-start">
             <i class="el-icon-edit"></i>
             </el-tooltip>
             </span>
             <span v-if="parseInt(message.deletable) === 1 && message.user.id === getUser.id" @click="deleteMsgDialog = true,messageDelete = message">
             <el-tooltip class="item" effect="dark" content="Delete message" placement="top-start">
             <i class="el-icon-delete"></i>
             </el-tooltip>
             </span>
           </div>
         </li>

         <!-- other user message  -->
         <li v-else>
           <div class="message-data">
             <span class="message-data-name" v-if="message.guest && message.guest.name">{{message.guest.name}}</span>
             <span class="message-data-name" v-else-if="message.user && getUser.id !== message.user.id">{{message.user.firstname}}</span>
             <span class="message-data-name" v-else>
             <span v-if="message.guest != null">(guest) {{(message.guest.name != null) ? message.guest.name : (message.guest.email != null) ? message.guest.email : '#'+message.guest.id}}</span>
             </span>
             <span class="message-data-time">{{localeTime(message.created_at)}} <span v-if="parseInt(message.is_edited) === 1">* edited</span></span>
           </div>
           <div class="message my-message">

             <!-- display message -->
             <!-- <span v-html="sanitize(message.parsed)" class="message-text"></span> -->
             <vue-markdown class="message-text" :source="sanitize(message.parsed)"></vue-markdown>

             <!-- url preview -->
             <div v-if="is_url(message.parsed)" style="margin-top:1em">
               <link-prevue :url="message.parsed">
               <template slot-scope="props">
                  <div class="card" style="width: 15rem;">
                    <a :href="props.url" target="_blank" v-if="typeof props.img !== 'undefined'">
                    <div class="card-img-top" :style="{ 'background-image': 'url(' + props.img + ')' }" :alt="props.title"></div>
                  </a>
                  <a :href="props.url" target="_blank" v-else-if="isImg(message.parsed)">
                  <div class="card-img-top" :style="{ 'background-image': 'url(' + message.parsed + ')' }" :alt="props.title"></div>
                </a>
                    <div class="card-block">
                      <div class="card-title">{{props.title}}</div>
                      <div class="link-prev">
                        <p class="card-text">{{props.description}}</p>
                      </div>
                      <div class="link-prev">
                      <a :href="props.url" class="btn btn-primary" target="_blank">More</a>
                      </div>
                    </div>
                  </div>
                </template>
             </link-prevue>
             </div>

             <!-- img or file display -->
              <span v-if="message.files.length >= 1" class="data-files">
                  <span v-for="(file,index) in message.files" :key="index">
                      <div v-if="file.thumbnail !== 'default.png' || file.extension === 'gif'" style="margin-bottom:1em">

                          <a :href="getFileUrl(file.name)" class="ref-link" target="_blank">
                              <div class="thumb-message" :style="{ 'background-image': 'url(' + getFileUrl(file.name) + ')' }" v-if="file.extension === 'gif'"></div>
                              <div class="thumb-message" :style="{ 'background-image': 'url(' + getThumbnailUrl(file.thumbnail) + ')' }" v-else></div>
                          </a>

                          <span class="name-size">

                                  <a :href="getFileDownloadUrl(file.name,file.original_name)" :download="file.original_name" >
                                      <span class="shorten-filename">{{file.original_name}}</span>
                                  </a>


                              {{file.size}}
                          </span>

                      </div>
                      <div v-else>
                          <a :href="getFileDownloadUrl(file.name,file.original_name)" :download="file.original_name" >
                              <span class="shorten-filename">{{file.original_name}}</span>
                          </a>
                          {{file.size}}
                      </div>

                  </span>
              </span>

           </div>
         </li>

         <span v-if="index === lastIndex" ref="lastMessageScroll" id="lastMessageScroll"></span>
       </ul>
     </div> <!-- end chat-history -->

      <el-dialog
      title="Confirm"
      :visible.sync="deleteMsgDialog"
      width="30%">
      <span>Are you sure you want to delete this message ?</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="deleteMsgDialog = false">No</el-button>
      <el-button type="primary" @click="deleteMsgDialog = false,deleteMessage(messageDelete)">Yes</el-button>
      </span>
      </el-dialog>

   </div> <!-- end chat -->


   <el-dialog
     title="Jump back"
     :visible.sync="dialogVisibleDate"
     width="30%">
     <div class="jumpBackLink" @click="loadMessagesByPeriod('year','Year')">year</div>
     <div class="jumpBackLink" @click="loadMessagesByPeriod('6months','6 Months')">6 months</div>
     <div class="jumpBackLink" @click="loadMessagesByPeriod('3months','3 Months')">3 months</div>
     <div class="jumpBackLink" @click="loadMessagesByPeriod('30days','30 Days')">30 days</div>
     <div class="jumpBackLink" @click="loadMessagesByPeriod('7days','7 Days')">7 days</div>
     <div class="jumpBackLink" @click="loadMessagesByPeriod('yesterday','Yesterday')">Yesterday</div>
     <div class="jumpBackLink" @click="loadMessagesByPeriod('today','Today')">Today</div>
   </el-dialog>

</div>
 </template>


 <script>
 import Vue from 'vue'
 import {
   mapGetters
 } from 'vuex'
 import socketMixin from '../../../mixins/modules/chat/socket'
 import { load as loadEmojis, parse, find as findEmojis } from 'gh-emoji'
 import moment from 'moment'
 import momentTz from 'moment-timezone'
 import dataLoader from '../../../mixins/modules/chat/dataLoader'
 import VueSanitize from 'vue-sanitize'
 import VueMarkdown from 'vue-markdown'
 import LinkPrevue from 'link-prevue'

 let defaultOptions = {
   allowedTags: ['a', 'b', 'img', 'i', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
   allowedAttributes: {
     'a': [ 'href' ],
     'img': ['src', 'class', 'alt']
   }
 }

Vue.use(VueSanitize, defaultOptions)

let protocol = location.protocol
let urlPath = (protocol === 'http:') ? 'http://localhost/' : 'https://dev.evrica.io/'

const chatFilesPath = urlPath + 'backend/chat/file'
const chatFilesThumbnailPath = urlPath + 'backend/chat/thumbnail/file'
const emojiThumbnailPath = urlPath + 'backend/chat/emoji/thumbnail'

 // var current date
 var currentDate
 var hasGroupDate

 export default {
   computed: {
     model: {
       get () {
         if (this.data) {
           // last index pos
           this.lastIndex = Math.abs(this.data.length - this.value.length)
           /** ############################## **/
           if (this.withPeriod) {
             // if full reloaded scroll top
             if (this.fullReload) {
               this.scrollTop()
             } else {
               // if period messages
               if (this.isPeriodUp && !this.isPeriodDown) {
                 this.scrollLastMessage()
                 // set page number
                 let pageNumber = this.currentPeriodPageUp++
                 // update page number message period
                 this.$store.dispatch('setCurrentMessagePeriodPageUp', {page: parseInt(pageNumber)})
               } else if (this.isPeriodDown && !this.isPeriodUp) {
                 this.scrollBottomMessages()
                 // set page number
                 let pageNumber = this.currentPeriodPageDown++
                 // update page number message period
                 this.$store.dispatch('setCurrentMessagePeriodPageDown', {page: parseInt(pageNumber)})
               } else {
                 this.scrollTop()
               }
             }
           }
           /** ############################## **/
           /** ############################## **/
           /** CHECK IF THERE IS ONLY ONE MESSAGE OR MORE AND APPLY SCROLL **/
           if (this.data.length < this.value.length && !this.withPeriod) {
             // get lengths
             let oldLength = parseInt(this.data.length)
             let newLength = parseInt(this.value.length)
             let incOldLength = parseInt(oldLength + 1)
             // check scroll
             if (newLength === incOldLength) {
               this.scrollBottom()
             } else {
               this.scrollLastMessage()
             }
             // increment page
             this.currentMessagePage++
             /** ############################## **/
           }
           // applied on switch period
           if (this.data.length === this.value.length && !this.sentMessage && !this.withPeriod) {
             this.scrollBottom()
           }
         }
         // data was loaded
         this.data = this.value
         this.parseDataMessage()
         this.$emit('messagesLoaded', true)
         return this.data
       }
     },
     returnMsgs: function () {
       if (this.value != null) {
         return this.value
       }
       return []
     },
     returnCurrentGuestData: function () {
       if (this.currentGuestData != null) {
         return this.currentGuestData
       }
       return []
     },
     returnCurrentUserData: function () {
       if (this.currentUserData != null) {
         return this.currentUserData
       }
       return []
     },
     returnCurrentRoomData: function () {
       if (this.currentRoomData != null) {
         return this.currentRoomData
       }
       return []
     },
     loadMoreMsgs: function () {
       if (this.loadMore != null) {
         return this.loadMore
       }
       return false
     },
     returnIsPeriodUp: function () {
       if (this.isPeriodUp != null) {
         return this.isPeriodUp
       }
       return false
     },
     returnSentMessage: function () {
       if (this.sentMessage != null) {
         return this.sentMessage
       }
       return false
     },
     returnSwitchPeriod: function () {
       if (this.switchPeriod != null) {
         return this.switchPeriod
       }
       return {}
     },
     returnPeriodFirstID: function () {
       if (this.periodFirstId != null) {
         return this.periodFirstId
       }
       return false
     },
     returnLeftRoom: function () {
       if (this.leftRoom != null) {
         return this.leftRoom
       }
       return 0
     },
     returnPeriodLastID: function () {
       if (this.periodLastId != null) {
         return this.periodLastId
       }
       return false
     },
     returnIsPeriodDown: function () {
       if (this.isPeriodDown != null) {
         return this.isPeriodDown
       }
       return false
     },
     currentMsgsPage: function () {
       if (this.currentMsgPage != null) {
         return this.currentMsgPage
       }
       return 0
     },
     ...mapGetters(['getToken', 'getUser', 'getAuthHeader', 'getEmojiList', 'getCurrentMessagePeriodPageUp', 'getCurrentMessagePeriodPageDown'])
   },
   data: function () {
     // datas
     return {
       displayPeriodText: 'Period',
       dialogVisibleDate: false,
       loadMoreMessages: false,
       currentMessagePagePeriod: 0,
       currentMessageLimitPeriod: 15,
       dataMessages: [],
       data: [],
       periodChanged: false,
       withPeriod: false,
       currentMessagePeriod: '',
       loaded: false,
       deleteMsgDialog: false,
       confirmDeleteMsg: false,
       renderTimer: false,
       lastScrollMessages: false,
       pageHeightMessages: 0,
       lastScrollMessagesContainer: false,
       pageHeightMessagesContainer: 0,
       messagesTop: false,
       messagesBottom: false,
       lastIndex: 0,
       messageDelete: null,
       currentMessagePage: 0,
       emojiThumbnailPath: emojiThumbnailPath,
       chatFilesPath: chatFilesPath,
       chatFilesThumbnailPath: chatFilesThumbnailPath,
       tick: 0,
       currentPeriodPageUp: 0,
       currentPeriodPageDown: 0,
       fullReload: false
     }
   },
   components: {
     VueMarkdown,
     LinkPrevue
   },
   watch: {
     switchPeriod: function (val) {
       if (val) {
         if (typeof val.switchPeriod !== 'undefined') {
           if (val.switchPeriod === true) {
             if (typeof val.to !== 'undefined') {
               if (val.to === 'today') {
                 this.data = []
                 this.currentMessagePage = 1
                 this.withPeriod = false
                 this.resetOffset()
                 this.loadMessages(true)
               }
             }
           }
         }
       }
     }
   },
   props: {
     value: {
       type: Array,
       default: () => {
         return {}
       }
     },
     currentGuestData: {
       default: () => {
         return {}
       }
     },
     currentRoomData: {
       default: () => {
         return {}
       }
     },
     currentUserData: {
       default: () => {
         return {}
       }
     },
     messageInput: {
       type: String,
       default: () => {
         return ''
       }
     },
     loadMore: {
       type: Boolean,
       default: () => {
         return false
       }
     },
     leftRoom: {
       type: Number,
       default: () => {
         return 0
       }
     },
     isPeriodUp: {
       type: Boolean,
       default: () => {
         return false
       }
     },
     sentMessage: {
       type: Boolean,
       default: () => {
         return false
       }
     },
     switchPeriod: {
       type: Object,
       default: () => {
         return {}
       }
     },
     isPeriodDown: {
       type: Boolean,
       default: () => {
         return false
       }
     },
     periodFirstId: {
       type: Number,
       default: () => {
         return 0
       }
     },
     periodLastId: {
       type: Number,
       default: () => {
         return 0
       }
     },
     messageEditing: {
       type: Boolean,
       default: () => {
         return false
       }
     },
     oldMessageIndex: {
       type: Number,
       default: () => {
         return 0
       }
     },
     currentMsgPage: {
       type: Number,
       default: () => {
         return 0
       }
     },
     currentRoomID: {
       type: Number,
       default: () => {
         return 0
       }
     }
   },
   mixins: [socketMixin, dataLoader],
   methods: {
     dataTime (date) {
       let offsets, localTexts, utcTimes, atTime

       offsets = this.moment().utcOffset()

       utcTimes = date

       localTexts = moment.utc(utcTimes).utcOffset(offsets).format()

       atTime = momentTz.tz(localTexts, this.timezone).calendar(null, {
         sameDay: '[Today]',
         nextDay: '[Tomorrow]',
         nextWeek: 'dddd',
         lastDay: '[Yesterday]',
         lastWeek: 'dddd',
         sameElse: 'dddd , MMMM DD - YYYY'
       })

       return atTime
     },
     isImg: function (url) {
       let extImg = [
         'png',
         'jpg',
         'gif',
         'jpeg',
         'webp'
       ]
       let splitted = url.split('.')
       let lastItem = splitted[splitted.length - 1]
       let isImg = extImg.includes(lastItem)

       return isImg
     },
     makeid: function () {
       var text = ''
       var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

       for (var i = 0; i < 5; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

       return text
     },
     is_url: function (str) {
       let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
       if (regexp.test(str)) {
         return true
       } else {
         return false
       }
     },
     sanitize (message) {
       if (typeof message === 'undefined') {
         return ''
       } else {
         let html = this.$sanitize(message)
         return html
       }
       // return message
     },
     moment: function (date) {
       return moment(date)
     },
     localeTime: function (timestamp) {
       let offset, localText, momentTime, createdDate, utcTime
       offset = this.moment().utcOffset()
       utcTime = timestamp
       localText = moment.utc(utcTime).utcOffset(offset).format()
       momentTime = momentTz.tz(localText, this.timezone).format()
       createdDate = this.moment(momentTime).fromNow()
       return createdDate
     },
     parseDataMessage: function () {
       var emojiList = this.getEmojiList
       var self = this
       this.data.forEach(function (el) {
         if (el.message) {
           let parseText = parse(el.message)
           let parsedString = parseText
           let findEmoji = findEmojis(parsedString)
           var parsedMessage = parsedString

           if (findEmoji.length >= 1) {
             findEmoji.forEach(function (emojiEl) {
               var x = new RegExp(emojiEl, 'g')
               let elementEmoji = emojiList[emojiEl]
               if (typeof elementEmoji !== 'undefined') {
                 let getImgTag = self.getCustomEmojiImgTag(elementEmoji.thumbnail)
                 parsedMessage = parsedMessage.replace(x, getImgTag)
               }
             })
             el.parsed = parsedMessage
           } else {
             el.parsed = parsedMessage
           }
         }
       })
     },
     getCustomEmojiImgTag: function (thumb) {
       let pathRoom = this.emojiThumbnailPath + '/'
       let pathThumb = pathRoom + thumb + '?token='
       let pathToken = pathThumb + this.getToken

       let makeTag = '<img src="' + pathToken + '" class="gh-emoji">'

       return makeTag
     },
     editMessage: function (data) {
       let messageData = data.message
       this.$emit('changeOldMessageIndex', this.data.indexOf(data))
       this.$emit('changeInput', messageData)
       this.$emit('changeEditing', true)
     },
     deleteMessage: function (data) {
       let indx = this.data.indexOf(data)
       if (indx > -1) {
         let data = { event: 'deleteMessage', data: { data: this.data[indx] } }
         this.sendSocketData(data)
         this.$delete(this.data, indx)
         this.messageDelete = ''
       }
     },
     groupMsg (date) {
       let offsets, localTexts, momentTimes, utcTimes, atTime

       offsets = this.moment().utcOffset()

       utcTimes = date

       localTexts = moment.utc(utcTimes).utcOffset(offsets).format()

       momentTimes = momentTz.tz(localTexts, this.timezone).format('DD-MM-YYYY')

       atTime = momentTz.tz(localTexts, this.timezone).calendar(null, {
         sameDay: '[Today]',
         nextDay: '[Tomorrow]',
         nextWeek: 'dddd',
         lastDay: '[Yesterday]',
         lastWeek: 'dddd',
         sameElse: 'dddd , MMMM DD - YYYY'
       })
       if (currentDate !== momentTimes) {
         currentDate = momentTimes
         let formatTime = atTime
         return formatTime
       }

       setTimeout(function () {
         currentDate = ''
       }, 50)

       return ''
     },
     hasGroup (date) {
       let offsets, localTexts, momentTimes, utcTimes

       offsets = this.moment().utcOffset()
       utcTimes = date
       localTexts = moment.utc(utcTimes).utcOffset(offsets).format()
       momentTimes = momentTz.tz(localTexts, this.timezone).format('DD-MM-YYYY')

       if (hasGroupDate !== momentTimes) {
         hasGroupDate = momentTimes
         return true
       }
     },
     checkEditDelete: function (time) {
       let locateDiff = this.localeDiff(time)
       let currentTime = this.moment().format()
       // set dates
       var now = currentTime
       var then = locateDiff
       // make diff
       var duration = moment.duration(moment(then).diff(moment(now)))
       var minutes = Math.abs(parseInt(duration.asMinutes()))

       if (minutes > 4) {
         return false
       }

       return true
     },
     localeDiff: function (timestamp) {
       let offset, localText, momentTime, utcTime, createdDate
       offset = this.moment().utcOffset()
       utcTime = timestamp
       localText = moment.utc(utcTime).utcOffset(offset).format()
       momentTime = momentTz.tz(localText, this.timezone).format()
       createdDate = this.moment(momentTime).format()
       return createdDate
     },
     bottomMessagesVisible () {
       let windowMessages = this.$refs.msgcontainer
       if (typeof windowMessages !== 'undefined') {
         let scrollY = windowMessages.scrollTop
         let visible = windowMessages.clientHeight
         let pageHeight = windowMessages.scrollHeight
         let bottomOfPage = visible + (scrollY + 10) >= pageHeight

         if (!this.lastScrollMessagesContainer && bottomOfPage) {
           this.lastScrollMessagesContainer = true
           this.pageHeightMessagesContainer = pageHeight
           return true
         } else if (this.lastScrollMessagesContainer && bottomOfPage) {
           this.lastScrollMessagesContainer = true
           return false
         } else if (!bottomOfPage) {
           this.lastScrollMessagesContainer = false
           return false
         }

         return bottomOfPage || pageHeight < visible
       }
     },
     resetOffset: function () {
       this.currentPeriodPageUp = 1
       this.currentPeriodPageDown = 1
       this.$store.dispatch('setCurrentMessagePeriodPageDown', {page: parseInt(1)})
       this.$store.dispatch('setCurrentMessagePeriodPageUp', {page: parseInt(1)})
     },
     upMessagesVisible () {
       let windowMessages = this.$refs.msgcontainer
       if (windowMessages) {
         let scrollY = windowMessages.scrollTop
         let visible = windowMessages.clientHeight
         let pageHeight = windowMessages.scrollHeight
         let bottomOfPage = visible + (scrollY + 10) >= pageHeight
         let offsetTop = (scrollY + 10)
         let topOfPage = (offsetTop <= 10)

         if (!this.lastScrollMessages && topOfPage) {
           this.lastScrollMessages = true
           this.pageHeightMessages = pageHeight
           this.loadMoreMessages = true
           return true
         } else if (this.lastScrollMessages && topOfPage) {
           this.lastScrollMessages = true
           return false
         } else if (!topOfPage) {
           this.lastScrollMessages = false
           return false
         }

         return bottomOfPage || pageHeight < visible
       }
     },
     scrollBottom: function () {
       var self = this
       Vue.nextTick(function () {
         var container = self.$refs.msgcontainer
         if (typeof container !== 'undefined') {
           container.scrollTop = container.scrollHeight + 100
         }
       })
     },
     scrollBottomMessages: function () {
       var self = this
       Vue.nextTick(function () {
         let container = self.$refs.msgcontainer
         container.scrollTo(0, self.pageHeightMessagesContainer)
       })
     },
     scrollTop: function () {
       var self = this
       Vue.nextTick(function () {
         var container = self.$refs.msgcontainer
         // if is container
         if (container) {
           container.scrollTop = 100
           container.scrollTop = 101
         }
       })
     },
     scrollLastMessage: function () {
       var self = this
       Vue.nextTick(function () {
         var container = self.$refs.msgcontainer
         var lastMessageContainer = document.getElementById('lastMessageScroll')
         if (lastMessageContainer) {
           lastMessageContainer.scrollIntoView({ duration: 'slow', direction: 'y', complete: function () { alert('Done') } })
         }
         if (typeof container !== 'undefined') {
           container.scrollBy(0, -200)
         }
       })
     },
     getFileUrl: function (filename) {
       let filePath = chatFilesPath
       let pathRoom = filePath + '/' + this.currentRoomID + '/'
       let pathFile = pathRoom + filename
       let pathToken = pathFile + '?token=' + this.getToken
       let fullPath = pathToken

       return fullPath
     },
     getFileDownloadUrl: function (filename, downloadName) {
       let filePath = chatFilesPath
       let pathRoom = filePath + '/' + this.currentRoomID + '/'
       let pathFile = pathRoom + filename + '/download/' + downloadName
       let pathToken = pathFile + '?token=' + this.getToken
       let fullPath = pathToken

       return fullPath
     },
     getThumbnailUrl: function (filename) {
       let thumbPath = chatFilesThumbnailPath
       let pathRoom = thumbPath + '/' + this.currentRoomID + '/'
       let pathFile = pathRoom + filename
       let pathToken = pathFile + '?token=' + this.getToken
       let fullPath = pathToken

       return fullPath
     },
     checkTimeMsgOptionp: function (date) {
       return true
     },
     updateMsgTime: function () {
       var self = this
       setInterval(function () {
         self.tick = 1
         self.tick = 0
       }, 60 * 1000)
     }
   },
   updated: function () {
     // listen scroll messages
     var windowMessages = this.$refs.msgcontainer
     if (windowMessages) {
       var self = this
       // listen for current timestamp
       windowMessages.addEventListener('scroll', () => {
          // setting current date
         var cutoff = windowMessages.scrollTop
         var elementSeparators = windowMessages.getElementsByClassName('message-data-body')
         var elementsFormat = [].slice.call(elementSeparators)

         // loop over elements
         for (var i = 0; i < elementsFormat.length; i++) {
           let topPos = elementsFormat[i].offsetTop
           let height = elementsFormat[i].offsetHeight
           let sum = parseInt(topPos + height) - 10
           let checkDim = (sum > cutoff)
            // check
           if (checkDim) {
             if (self.displayPeriodText === elementsFormat[i].dataset.time) {
               return false
             } else {
               self.displayPeriodText = elementsFormat[i].dataset.time
               return false
             }
           }
         }
       })

       // listen for load more messages
       windowMessages.addEventListener('scroll', () => {
         this.messagesTop = this.upMessagesVisible()
         this.messagesBottom = this.bottomMessagesVisible()

         // set that JumpBack up
         if (this.messagesTop && this.withPeriod) {
           this.JumpBackUp = true
           this.JumpBackDown = false
           let data = {periodUp: this.JumpBackUp, periodDown: this.JumpBackDown, withPeriod: this.withPeriod}
           this.$emit('changePeriods', data)
           if (this.currentRoomID !== 0) {
             this.$emit('loading', true)
             this.loadMessagesByDirection('up')
             this.$emit('changeLoadMore', true)
           }
         }

         // set that JumpBack is down
         if (this.messagesBottom && this.withPeriod) {
           this.JumpBackUp = false
           this.JumpBackDown = true
           let data = {periodUp: this.JumpBackUp, periodDown: this.JumpBackDown, withPeriod: this.withPeriod}
           this.$emit('changePeriods', data)
           if (this.currentRoomID !== 0) {
             this.$emit('loading', true)
             this.loadMessagesByDirection('down')
             this.$emit('changeLoadMore', true)
           }
         }

         if (this.messagesTop && !this.withPeriod) {
           if (this.currentRoomID !== 0) {
             this.loadMessages()
             this.$emit('changeLoadMore', true)
           }
           this.$nextTick(function () {
             var container = self.$refs.msgcontainer
             container.scrollTo(0, 0)
           })
         }
       })
     }
   },
   created: function () {
     this.updateMsgTime()
     var self = this
     loadEmojis().then(function () {
       self.data = self.returnMsgs
       self.loaded = true
       self.loadMoreMessages = self.loadMoreMsgs
       self.currentMessagePage = self.currentMsgsPage
       self.isPeriodUp = self.returnIsPeriodUp
       self.isPeriodDown = self.returnIsPeriodDown
       self.periodFirstId = self.returnPeriodFirstID
       self.periodLastId = self.returnPeriodLastID
       self.currentGuestData = self.returnCurrentGuestData
       self.currentRoomData = self.returnCurrentRoomData
       self.currentUserData = self.returnCurrentUserData
       self.sentMessage = self.returnSentMessage
       self.currentPeriodPageUp = self.getCurrentMessagePeriodPageUp
       self.currentPeriodPageDown = self.getCurrentMessagePeriodPageDown
       self.switchPeriod = self.returnSwitchPeriod
       self.leftRoom = self.returnLeftRoom

       if (self.withPeriod && self.isPeriodUp && !self.isPeriodDown) {
         self.scrollTop()
       } else if (self.withPeriod && !self.isPeriodUp && self.isPeriodDown) {
         self.scrollBottomMessages()
       } else {
         if (self.loadMoreMessages === false && self.data.length > 5) {
           self.scrollBottom()
         }
       }
     })
   }
 }
 </script>
 <style>
 .gh-emoji{
   width: 25px;
   height: 25px;
   position: relative;
   top:5px;
 }
 .thumb-message{
   width: 100px;
   height: 100px;
   background-size: cover;
   background-repeat: no-repeat;
   background-position: 50% 50%;
 }
 .ref-link{
   color: inherit; /* blue colors for links too */
   text-decoration: inherit; /* no underline */
 }



 .chat .chat-header {
   border-bottom: 2px solid white;
 }
 .chat .chat-header img {
   float: left;
 }
 .chat .chat-header .chat-about {
   float: left;
   padding-left: 10px;
   margin-top: 6px;
 }
 .chat .chat-header .chat-with {
   font-weight: bold;
   font-size: 16px;
 }
 .chat .chat-header .chat-num-messages {
   color: #92959E;
 }
 .chat .chat-header .fa-star {
   float: right;
   color: #D8DADF;
   font-size: 20px;
   margin-top: 12px;
 }

 .chat .chat-history {
   /* height: 450px; */
   padding-bottom: 2em;
   padding-top: 2em;
 }

 .chat .chat-history .message-data {
   margin-bottom: 15px;
 }
 .chat .chat-history .message-data-time {
   color: #a8aab1;
   padding-left: 6px;
 }
 .chat .chat-history .message {
   color: white;
   padding: 18px 15px;
   font-size: 1.2em;
   border-radius: 7px;
   margin-bottom: 10px;
   line-height: 1.3em;
   width: 90%;
   position: relative;
 }
 .chat .chat-history .message:after {
   bottom: 100%;
   left: 7%;
   border: solid transparent;
   content: " ";
   height: 0;
   width: 0;
   position: absolute;
   pointer-events: none;
   border-bottom-color: #86BB71;
   border-width: 10px;
   margin-left: -10px;
 }
 .chat .chat-history .my-message {
   background: #86BB71;
 }
 .chat .chat-history .other-message {
   background: #94C2ED;
 }
 .chat .chat-history .other-message:after {
   border-bottom-color: #94C2ED;
   left: 93%;
 }

 .chat .chat-message {
   padding: 30px;
 }
 .chat .chat-message textarea {
   width: 100%;
   border: none;
   padding: 10px 20px;
   font: 14px/22px "Lato", Arial, sans-serif;
   margin-bottom: 10px;
   border-radius: 5px;
   resize: none;
 }
 .chat .chat-message .fa-file-o, .chat .chat-message .fa-file-image-o {
   font-size: 16px;
   color: gray;
   cursor: pointer;
 }
 .chat .chat-message button {
   float: right;
   color: #94C2ED;
   font-size: 16px;
   text-transform: uppercase;
   border: none;
   cursor: pointer;
   font-weight: bold;
   background: #F2F5F8;
 }
 .chat .chat-message button:hover {
   color: #75b1e8;
 }

 .online, .offline, .me {
   margin-right: 3px;
   font-size: 10px;
 }

 .online {
   color: #86BB71;
 }

 .offline {
   color: #E38968;
 }

 .me {
   color: #94C2ED;
 }

 .align-left {
   text-align: left;
 }

 .align-right {
   text-align: right;
 }

 .float-right {
   float: right;
 }

 .clearfix:after {
   visibility: hidden;
   display: block;
   font-size: 0;
   content: " ";
   clear: both;
   height: 0;
 }

 .message-timestamp {
   color: #ccc;
   margin: 0 auto;
   margin-left: 40%;
   margin-bottom: 1em;
   font-weight: bold;
   clear: both;
   display: block;
 }

 .main-chat{
   height: 480px;
   max-height: 480px;
   overflow-y: scroll;
   overflow-x: hidden;
   padding-right: 2em;
   /* position: relative; */
 }

 .main-chat::-webkit-scrollbar {
   width: 5px;
 }

 .main-chat::-webkit-scrollbar-thumb {
   border-radius: 10px;
   -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
   background-color: #555;
 }

 .message-data-name{
   font-weight: bold;
   font-size: 1.2em;
 }

 .edit-delele-message{
   position: relative;
   width: 90%;
 }

 .jumpBackLink{
   padding: 1em;
   padding-bottom: 0.5em;
   cursor: pointer;
   border-bottom: 1px solid #ccc;
   transition: 0.3s;
 }

 .jumpBackLink:hover{
   padding: 1em;
   padding-bottom: 0.5em;
   cursor: pointer;
   border-bottom: 1px solid #ccc;
   background-color: #f2f2f2;
 }

 .message-text{
   word-wrap: break-word;
 }

 .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.name-size{
  position: relative;
  top: 5px;
}

a{
  color: inherit;
}

.shorten-filename{
  display: block;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

h1, h2, h3, h4, h5, h6, p {
    display: inline;
}

.card{
  background-color: #fff;
  font-weight: bold;
  color: #000;
  border-radius: 10px;
  padding: 1em;
  font-size: 0.7em;
}

.card-img-top{
  height: 100px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}

.card-title{
  margin-top: 0.5em;
}

.card-text{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 16px;     /* fallback */
  max-height: 32px;      /* fallback */
  -webkit-line-clamp: 2; /* number of lines to show */
  -webkit-box-orient: vertical;
  margin: 0 !important;
}

.link-prev{
  margin-top: 0.5em;
}

.currentTimestamp{
  position: relative;
  top: 10px;
  margin-left: 40%;
  font-weight: bold;
  cursor: pointer;
  font-weight: 700;
    font-size: 15px;
}

.msg-date-separator {
    display: -ms-flexbox;
    display: flex;
    height: 8px;
    border-bottom: 1px solid #ddd;
    position: relative;
    margin: 30px 0;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-line-pack: center;
    align-content: center;
    -ms-flex-pack: center;
    justify-content: center;
}

.msg-date-separator span {
    color: #464a4c;
    display: block;
    text-align: center;
    padding: 5px 15px 0;
    background-color: #fff;
    font-weight: 700;
    font-size: 16px;
}

.img{
  width: 100%;
}

.box-top{
  -webkit-box-shadow: 0px 2px 63px -10px rgba(186,186,186,1);
  -moz-box-shadow: 0px 2px 63px -10px rgba(186,186,186,1);
  box-shadow: 0px 2px 63px -10px rgba(186,186,186,1);
  /* height: 112px; */
}

.user-pic{
  width: 40px;
  height: 40px;
  border-radius: 50px;
background-size: cover;
background-repeat: no-repeat;
background-position: 50% 50%;
}

.media, .media-body {
    overflow: hidden;
    zoom: 1;
}
.media {
}

.media-body, .media-left, .media-right {
    display: table-cell;
    vertical-align: top;
}

.media-left, .media>.pull-left {
    padding-right: 10px;
}

.media-body, .media-left, .media-right {
    display: table-cell;
    vertical-align: top;
}
.media-body {
    width: 10000px;
}
.media, .media-body {
    overflow: hidden;
    zoom: 1;
}

.chatMessages{
    height: 550px;
}

 </style>
