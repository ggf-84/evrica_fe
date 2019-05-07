<template>
<div class="chat">
  <!-- ############################################################### -->
  <transition name="fade">
    <div class="loading" v-if="isLoading === true">Loading&#8230;</div>
  </transition>
  <!-- ############################################################### -->

  <div class="row">

    <div class="three columns col-left">
      <el-tabs v-model="activeName" @tab-click="handleClick">

          <!-- ############################################################### -->
          <el-tab-pane label="Rooms" name="first">
          <!-- rooms box -->
          <div>
            <br>
            <div>
              <el-input placeholder="Search room by title" v-model="roomSearchTitle" class="searchTitle" @keyup.enter.native="getRoomsByTitle()"></el-input>
              <button @click="getRoomsByTitle()">Search</button>
            </div>
            <div class="scroll-rooms" ref="roomcontainer">
              <span v-if="rooms.length  === 0">There are no rooms available</span>
              <br>
              <div v-for='(room, index) in rooms' :key="index">
                <div>

                  <!-- room button  with badge -->
                  <el-badge :value="room.unread" class="item" :max="99">
                    <el-button size="small" @click="joinRoom(room.room_id),updateUnreadCounter('room',room.room_id),currentMessagePage = 1,setCurrentRoomData(room,'room')">{{(room) ? room.title : 'unknown'}}</el-button>
                  </el-badge>

                  <!-- leave button with el-tooltip -->
                  <el-tooltip content="Leave room" placement="top" v-if="parseInt(room.owner_id) !== parseInt(getUser.id)">
                    <button class="btn-leave" @click="leaveRoom(room.room_id,index)"><i class="el-icon-arrow-right"></i></button>
                  </el-tooltip>

                  <!-- delete button with el-tooltip -->
                  <el-tooltip content="Delete room" placement="top" v-if="parseInt(room.owner_id) === parseInt(getUser.id)">
                    <button class="btn-del" @click="deleteRoomDialog = true, roomDelete = room"><i class="el-icon-delete"></i></button>
                  </el-tooltip>

                  <!-- delete button with el-tooltip -->
                  <el-tooltip content="Settings" placement="top" v-if="parseInt(room.owner_id) === parseInt(getUser.id)">
                    <button class="btn-del" @click="deleteRoomSettingDialog = true, leftRoomUsers = [], loadLeftRoomUsers(room.room_id,currentLeftRoomPage,5), currentRoomSettings = room.room_id"><i class="el-icon-setting"></i></button>
                  </el-tooltip>

                </div>
              </div>
              <!-- refresh list -->
              <el-tooltip content="Refresh" placement="top">
                <button @click="loadRooms(currentRoomPage,5)"><i class="el-icon-refresh"></i></button>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
        <!-- ############################################################### -->

        <!-- ############################################################### -->
        <el-tab-pane label="People" name="second">
          <!-- people box -->
          <div>
            <br>
            <div>
              <el-input placeholder="Search employee by firstname" v-model="employeeSearchTitle" class="searchTitle" @keyup.enter.native="getEmployeesByName()"></el-input>
              <button @click="getEmployeesByName()">Search</button>
            </div>
            <!-- scroll employees  -->
            <div class="scroll-employees" ref="employeecontainer" id="employees-scroll">
              <span v-if="employees.length  === 0">There are no people available</span>
              <br>
              <div v-for='(employee, index) in employees' :key="index">
                <!-- employee button  with badge -->
                <el-badge :value="employee.unread" class="item" :max="99">
                  <el-button size="small" @click="joinRoom(employee.room_id,employee.user_id),setCurrentRoomData(employee,'employee')" v-if="employee.room_id==='0'">
                    {{employee.firstname}} {{employee.lastname}}
                    <span v-bind:class="{'status-connection-offline':true, 'status-connection-online':(employee.online === true )}">{{status(employee.online)}}</span>
                  </el-button>
                  <el-button size="small" @click="joinRoom(employee.room_id),updateUnreadCounter('employee',employee.room_id,employee.user_id),setCurrentRoomData(employee,'employee')" v-else>{{employee.firstname}} {{employee.lastname}}
                    <span v-bind:class="{'status-connection-offline':true, 'status-connection-online':(employee.online === true )}">{{status(employee.online)}}</span>
                  </el-button>
                </el-badge>
                <!-- end employee button badge -->
              </div>
              <!-- refresh list -->
              <el-tooltip content="Refresh" placement="top">
                <button @click="currentEmployeePage = 1 , loadEmployees(currentEmployeePage,5)"><i class="el-icon-refresh"></i></button>
              </el-tooltip>
              <!-- end refresh list -->
            </div>
            <!-- end scroll employees -->
          </div>
        </el-tab-pane>
        <!-- ############################################################### -->

        <!-- ############################################################### -->
        <el-tab-pane label="Guests" name="third" v-if="getUser.livechat_agent">
          <!-- guests box -->
          <div>
            <br>
            <div>
              <el-input placeholder="Search guest by title" v-model="guestSearchTitle" class="searchTitle" @keyup.enter.native="getGuestsByTitle()"></el-input>
              <button @click="getGuestsByTitle()">Search</button>
            </div>
            <!-- scroll guests  -->
            <div class="scroll-guests" ref="guestcontainer" id="guests-scroll">
              <span v-if="guests.length  === 0">There are no guests available</span>
              <br>
              <div v-for='(guest, index) in guests' :key="index">
                <!-- guest button  with badge -->
                <el-badge :value="parseInt(guest.unread)" class="item" :max="99">
                  <el-button size="small" @click="joinRoom(guest.room_id),updateUnreadCounter('guest',guest.room_id,guest.guest_id),setCurrentRoomData(guest,'guest')">
                    {{(guest.name !== null) ? guest.name : 'Guest #' + guest.guest_id}}
                    <span v-bind:class="{'status-connection-offline':true, 'status-connection-online':(guest.online === true )}">{{status(guest.online)}}</span>
                  </el-button>
                </el-badge>
                <!-- end employee button badge -->
              </div>
              <!-- refresh list -->
              <el-tooltip content="Refresh" placement="top">
                <button @click="curretnGuestPage = 1 , loadGuests(currentGuestPage,5)"><i class="el-icon-refresh"></i></button>
              </el-tooltip>
              <!-- end refresh list -->
            </div>
            <!-- end scroll guests -->
          </div>
        </el-tab-pane>
        <!-- ############################################################### -->

      </el-tabs>

    </div>

    <!-- middle bar -->
    <div class="six columns col-left">


      <div class="chat-scroll-container">

        <!-- ############################################################### -->
        <!-- message container  -->
        <div class="messages-container" >
          <div v-if='messages.length === 0'>
            <div v-if="parseInt(currentRoomID) !== 0">
              There are still no messages to display , <b>write one !</b>
            </div>
            <div v-else>
            There are still no messages to display , <b>select a conversation !</b>
            </div>
          </div>
          <div v-if="messages.length !== 0">
            <!-- chat messages -->
            <chatMessages v-model="messages"
            :currentGuestData="currentGuestData"
            :currentUserData="currentUserData"
            :currentRoomData="currentRoomData"
            :currentMsgPage="parseInt(currentMessagePage)"
            :currentRoomID="parseInt(currentRoomID)"
            :isPeriodUp="periodUp"
            :isPeriodDown="periodDown"
            :periodFirstId="parseInt(periodFirstId)"
            :periodLastId="parseInt(periodLastId)"
            :loadMore="loadMoreMessages"
            :messageInput="messageInput"
            :messageEditing="messageEditing"
            :sentMessage="sentMessage"
            :switchPeriod="switchPeriodData"
            :leftRoom="leftRoom"
            @loading="onLoading"
            @wasSwitched="eventWasSwitched($event)"
            @changePeriods="eventPeriods($event)"
            @changeInput="eventInput($event)"
            @changeEditing="eventEditing($event)"
            @changeLoadMore="eventLoadMore($event)"
            @changeOldMessageIndex="eventOldIndex($event)"
            @changeWithPeriod="eventWithPeriod($event)"
            @messagesLoaded="eventMessagesLoaded($event)"></chatMessages>
          </div>
          <div class="height-500" v-else></div>
        </div>
        <!-- end messages container  -->
        <!-- ############################################################### -->
      </div>
      <div class="chat-input-container">
        <!-- ############################################################### -->
      <!-- input message box -->
      <div>

          <div>
            <!-- <span v-if="((userIsTyping === true && withPeriod === false) === false) || ((sentMessage === true && withPeriod === true) === false)">JHelloo</span> -->
            <!-- typing message box -->
              <transition name="fade">
                <span v-if="userIsTyping === true && withPeriod === false">
                  <span class="user-typing-text"><b>{{typingMessage}}</b></span>
                </span>
                <span v-else-if="userIsTyping === true && withPeriod === true">
                  <span class="user-typing-text"><b>{{typingMessage}}</b></span>
                </span>
                <span  v-else-if="sentMessage === true && withPeriod === true">
                  <span>You have a new message , click <span class="redirectPeriod" @click="switchPeriod('today')"><b><i>here</i></b></span> to read</span>
                </span>
                <span v-else>
                  &nbsp;
                </span>
              </transition>
          </div>

        <!-- end typing box -->
        <!-- are input  -->
        <div  style="position:relative;top: 20px;">
        <textarea class="u-full-width textarea-input" ref="messageInput" placeholder="Your message here …"
        v-model="messageInput" :disabled="leftRoom === 1" @keyup.enter="setSendSaveMessage">
        </textarea>
        <transition name="fade">
          <emojiPicker v-if="emojiPick" @loading="onLoading" @emojiSelect="onEmojiSelect" @closePicker="onClosePicker" :custom="customEmoji"></emojiPicker>
        </transition>
      </div>
        <span v-if="leftRoom === 0">
          <button @click="setSendSaveMessage" :disabled="leftRoom === 1">Send</button>
          <span v-if="currentRoomID !== 0">
          <button @click="showEmojiPicker()" :disabled="leftRoom === 1">pick emoji</button>
          <button @click="filePick = true" :disabled="leftRoom === 1">upload file</button>
          </span>
        </span>
        <!-- end area input -->
      </div>
      <!-- end input message box -->
      <!-- ##################################################################### -->
      </div>


    </div>

    <!-- right bar -->
    <div class="three columns">
      <button @click="showHideSettings()">Chat Settings</button>
      <button class="createRoomBtn" @click="dialogVisible = true">Create a room</button>
      <button class="createRoomBtn" @click="dialogChatVisible = true">Chat invites {{totalInvites}}</button>
      <chatSettings :showSettings="showSettings" @hideSettings="onHideSettings" :chatSettings="chatSettings"></chatSettings>
    </div>
    <!-- end right bar -->


  </div>

  <!-- Notifications -->
  <notifications group="chat" />

  <!-- Invite page -->
  <el-dialog title="Please , invite at least two users in room !" :visible.sync="dialogVisible" width="30%">
    <div>
      <div ref="inivteUsersList" class="inviteUsersContainer">
        <el-checkbox-group v-model="checkList">
          <input class="roomNameInput" v-model="roomNameInput"></input>
          <el-checkbox :label="employee.user_id" border v-for='(employee, index) in employees' :key="index">
            {{employee.firstname}} {{employee.lastname}}
          </el-checkbox>
        </el-checkbox-group>
        <el-button type="primary" @click="loadEmployees(currentEmployeePage,5)"><i class="el-icon-refresh"></i></el-button>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = true, dialogDepartmentVisible = true, loadDepartments(currentDepartmentsPage,5)" v-if="getUser.is_admin">Choose a department to create room</el-button>
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="chatInvite()">Confirm</el-button>
    </span>
  </el-dialog>

  <!-- Invite page -->
  <el-dialog title="Please , select a department to create room" :visible.sync="dialogDepartmentVisible" width="30%">
    <div>

      <div ref="departmentsList" class="departmentsContainer">
        <el-checkbox-group v-model="checkListDepartments">
          <el-checkbox :label="department.id" border v-for='(department, index) in departments' :key="index">
            <span v-if="typeof department.i18n.title !== 'undefined'">{{department.i18n.title}}</span>
            <span v-else >Department #{{department.id}}</span>
          </el-checkbox>
        </el-checkbox-group>
        <el-button type="primary" @click="loadDepartments(currentDepartmentsPage,5)"><i class="el-icon-refresh"></i></el-button>
      </div>

    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogDepartmentVisible = false">Cancel</el-button>
      <el-button type="primary" @click="createRoomDepartment()">Confirm</el-button>
    </span>
  </el-dialog>

  <!-- Chat invites modal -->
  <el-dialog :title="'Your chat invites ' + totalInvites" :visible.sync="dialogChatVisible" width="30%">
    <div>
      <div ref="inviteContainer" class="chatInvitesContainer">
        <span v-if="invites.length === 0">There are still no chat invites to display</span>
        <div v-for='(invite, index) in invites' :key="index">
          <div v-if="invite.room !== null">
            <span v-if="invite.user !== null" class="inviteTitle">
            <b>{{invite.user.firstname}}</b>
            invited you to room
            {{invite.room.title}}
            </span>
            <span v-else>unknown</span>
            <el-button @click="acceptInvite(invite.room.id,index)">Accept</el-button>
            <el-button @click="declineInvite(invite.room.id,index)">Decline</el-button>
          </div>
        </div>

        <!-- refresh list -->
        <el-tooltip content="Refresh" placement="top">
          <button @click="loadChatInvites(currentChatInvitePage,10)"><i class="el-icon-refresh"></i></button>
        </el-tooltip>

      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogChatVisible = false">Cancel</el-button>
    </span>
  </el-dialog>

  <!-- Upload file modal -->
  <el-dialog title="Click 'select file' to upload a file" :visible.sync="filePick" width="30%">
    <div>
      <el-upload class="upload-demo" :action="chatFilesUploadPath+'?room_id='+currentRoomID+'&token='+getToken" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="8" :on-exceed="handleExceed"
        :file-list="fileList" :on-success="handleSuccess" name="files[]">
        <el-button size="small" type="primary">Select file</el-button>
        <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
      </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="filePick = false">Cancel</el-button>
    <el-button type="primary" @click="filePick = false">Confirm</el-button>
  </span>
  </el-dialog>


  <el-dialog
  title="Confirm"
  :visible.sync="deleteRoomDialog"
  width="30%">
  <span>Are you sure you want to delete this room ?</span>
  <span slot="footer" class="dialog-footer">
  <el-button @click="deleteRoomDialog = false">No</el-button>
  <el-button type="primary" @click="deleteRoomDialog = false, deleteRoom(roomDelete)">Yes</el-button>
  </span>
  </el-dialog>


  <el-dialog
  title="Room settings"
  :visible.sync="deleteRoomSettingDialog"
  width="30%">
  <div>
    <div ref="leftRoomList" class="leftRoomContainer">
      <div v-if="parseInt(leftRoomUsers.length) !== 0">
        <el-checkbox-group v-model="checkListLeftRoom">
          <el-checkbox :label="user.user.id" border v-for='(user, index) in leftRoomUsers' :key="index">
            {{user.user.firstname}} {{user.user.lastname}} left on {{user.updated_at}}
          </el-checkbox>
        </el-checkbox-group>
        <el-button type="primary" @click="loadLeftRoomUsers(currentRoomSettings, currentLeftRoomPage,5)"><i class="el-icon-refresh"></i></el-button>
      </div>
      <div v-else>
        Nothing to display
      </div>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="deleteRoomSettingDialog = false">Cancel</el-button>
    <el-button type="primary" @click="deleteRoomSettingDialog = false, inviteBack()" v-if="parseInt(leftRoomUsers.length) !== 0">Confirm</el-button>
  </span>
  </el-dialog>


</div>
</template>

<script>
import 'skeleton-css/css/normalize.css'
import {
  mapGetters
} from 'vuex'
import chatMixin from '../../../mixins/modules/chat/chat.js'
import eventMixin from '../../../mixins/modules/chat/event.js'
import notificationMixin from '../../../mixins/modules/chat/notification.js'
import handlerMixin from '../../../mixins/modules/chat/handler.js'
import loaderMixin from '../../../mixins/modules/chat/dataLoader.js'
import displayMixin from '../../../mixins/modules/chat/dataDisplay.js'
import uploadMixin from '../../../mixins/modules/chat/upload.js'
import emojiMixin from '../../../mixins/modules/chat/emoji.js'
import socketMixin from '../../../mixins/modules/chat/socket.js'
import globalNotificationMixin from '../../../mixins/modules/chat/globalNotification.js'
import Vue from 'vue'
import VueNativeNotification from 'vue-native-notification'
import Visibility from 'visibilityjs'
import Notifications from 'vue-notification'
import momentTz from 'moment-timezone'
import message from './message.vue'
import chatMessages from './chatMessages'
import emojiPicker from './emojiPicker'
import chatSettings from './chatSettings'

let protocol = location.protocol
let urlPath = (protocol === 'http:') ? 'http://localhost/' : 'https://dev.evrica.io/'

const chatFilesUploadPath = urlPath + 'backend/api/message/upload'

// socket connection

Vue.use(Notifications)
Vue.use(VueNativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true
})
Vue.use(Visibility)

export default {
  props: {
    authRequested: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  computed: {
    returnAuthRequested: function () {
      if (this.authRequested != null) {
        return this.authRequested
      }
      return false
    },
    ...mapGetters(['getToken', 'getUser', 'getAuthHeader'])
  },
  name: 'Chat',
  data () {
    return {
      currentRoomLimit: 5,
      currentEmployeeLimit: 5,
      roomSearchTitle: 'al',
      guestSearchTitle: '1',
      employeeSearchTitle: 'jo',
      typingMessage: '',
      currentRoomSettings: 0,
      deleteRoomSettingDialog: false,
      authStatus: true,
      dialogDepartmentVisible: false,
      displayPeriodText: 'Today',
      periodUp: false,
      withPeriod: false,
      periodDown: false,
      periodLastId: 0,
      periodFirstId: 0,
      token: '',
      dialogVisibleDate: false,
      rooms: [],
      employees: [],
      checkListLeftRoom: [],
      invites: [],
      currentRoomPage: 1,
      currentEmployeePage: 1,
      currentChatInvitePage: 1,
      currentMessagePage: 1,
      currentRoomID: 0,
      messages: [],
      moreMessages: [],
      loadMoreMessages: false,
      messageInput: '',
      deleteRoomDialog: false,
      roomNameInput: 'AlphaRoom',
      eventuser: 3,
      visiblePage: true,
      updateListEmployees: false,
      showModal: false,
      roomArrayIndex: null,
      inviteArrayIndex: null,
      dialogVisible: false,
      dialogChatVisible: false,
      timezone: '',
      currentLeftRoomPage: 1,
      checkList: [],
      customEmoji: [],
      userIsTyping: false,
      typingTimer: 3000,
      inputLength: 0,
      typings: [],
      onlineList: [],
      totalInvites: 0,
      leftRoom: 0,
      messageEditing: false,
      oldMessageIndex: '',
      fileList: [],
      messageInputCopy: '',
      currentRoomData: [],
      currentUserData: [],
      currentGuestData: [],
      lastScrollRoom: false,
      chatFilesUploadPath: chatFilesUploadPath,
      pageHeightRoom: 0,
      lastScrollEmployees: false,
      pageHeightEmployees: 0,
      lastScrollMessages: false,
      pageHeightMessages: 0,
      lastScrollChatInvites: false,
      pageHeightChatInvites: 0,
      lastScrollCreateRoom: false,
      lastScrollDepartments: false,
      lastScrollLeftRooms: false,
      leftRoomBottom: false,
      pageHeightLeftRoom: 0,
      pageHeightDepartments: 0,
      pageHeightCreateRoom: 0,
      departmentsBottom: false,
      newContactReq: false,
      filePick: false,
      uploadFileAction: 'http://localhost/backend/api/upload/file',
      activeName: 'second',
      isLoading: false,
      roomsBottom: false,
      employeesBottom: false,
      messagesTop: false,
      emojiPick: false,
      chatInvitesBottom: false,
      createRoomBottom: false,
      showSettings: false,
      chatSettings: [],
      roomDelete: null,
      currentGuestPage: 1,
      currentGuestLimit: 5,
      sentMessage: false,
      lastScrollGue: false,
      pageHeightGuests: 0,
      guestsBottom: false,
      guests: [],
      currentMessagePagePeriod: 1,
      currentMessageLimitPeriod: 15,
      currentMessagePeriod: '',
      msgsCopy: [],
      switchPeriodData: {},
      currentDepartmentsPage: 1,
      departments: [],
      checkListDepartments: [],
      leftRoomUsers: [],
      events: {
        auth: function (dataMessage, self) {
          var data = {
            event: 'socketConnected',
            data: {}
          }
          self.$socket.json.send(data)
          // loaders for auth
          self.loadRooms(self.currentRoomPage, 10)
          self.loadEmployees(self.currentEmployeePage, 5)
          self.loadGuests(self.currentGuestPage, 5)
          self.loadChatInvites(self.currentChatInvitePage, 10)
          self.getOnlines()
        },
        getInvites: function (dataMessage, self) {
          self.totalInvites = dataMessage.message.total
          self.displayChatInvites(dataMessage.message.invites)
        },
        getDepartments: function (dataMessage, self) {
          self.displayDepartments(dataMessage.message.departments)
        },
        getLeftRoomUsers: function (dataMessage, self) {
          self.displayLeftRoomUsers(dataMessage.message.users)
        },
        newEmoji: function (dataMessage, self) {
          self.$store.dispatch('setCurrentEmoji', {})
          .then(response => {})
          self.customEmoji = self.customEmoji.concat(dataMessage.message)
        },
        getEmojis: function (dataMessage, self) {
          self.customEmoji = self.customEmoji.concat(dataMessage.message)
          // get new emoji
          self.$store.dispatch('setCurrentEmoji', {})
        },
        getRooms: function (dataMessage, self) {
          self.displayRooms(dataMessage.message.rooms)
        },
        getEmployees: function (dataMessage, self) {
          self.displayEmployees(dataMessage.message.employees)
        },
        getGuests: function (dataMessage, self) {
          self.displayGuests(dataMessage.message.guests)
        },
        authGuest: function (dataMessage, self) {
          self.guests = []
          self.currentGuestPage = 1
          self.loadGuests(self.currentGuestPage, 5)
        },
        getChatSettings: function (dataMessage, self) {
          // self.chatSettings = self.chatSettings.concat(dataMessage.message)
          self.chatSettings = dataMessage.message
        },
        inviteBack: function (dataMessage, self) {
          self.invites = []
          self.currentChatInvitePage = 1
          self.loadChatInvites(self.currentChatInvitePage, 10)
        },
        joinChatRoom: function (dataMessage, self) {
          if (dataMessage.message.showMessages === true && parseInt(self.currentRoomID) === parseInt(dataMessage.message.roomID)) {
            if (self.$socket.id === dataMessage.message.connection) {
              self.showRoomMessages(dataMessage.message.roomID, self.currentMessagePage, 15)
            }
          }
        },
        joinRoomChat: function (dataMessage, self) {
          let validate = self.validateRequest(dataMessage)
          if (validate) {
            // check if we can show messages to user and current room id match with response room id
            if (dataMessage.message.show === true && parseInt(self.currentRoomID) === parseInt(dataMessage.message.room.id)) {
              if (self.$socket.id === dataMessage.message.connection) {
                if (dataMessage.message.limitID !== null) {
                  self.leftRoom = 1
                  self.showRoomMessages(dataMessage.message.room.id, self.currentMessagePage, 15, dataMessage.message.limitID)
                } else {
                  self.leftRoom = 0
                  self.showRoomMessages(dataMessage.message.room.id, self.currentMessagePage, 15)
                }
              }
            }
          }
        },
        showRoomMessages: function (dataMessage, self) {
          let validate = self.validateRequest(dataMessage)
          if (validate) {
            self.displayMessages(dataMessage.message.message)
          }
        },
        getMessagesByDirection: function (dataMessage, self) {
          let validate = self.validateRequest(dataMessage)
          if (validate) {
            self.displayMessages(dataMessage.message.messages, dataMessage.message.direction)
          }
        },
        getMessagesByPeriod: function (dataMessage, self) {
          let validate = self.validateRequest(dataMessage)
          if (validate) {
            if (parseInt(dataMessage.message.room.id) === parseInt(self.currentRoomID)) {
              if (dataMessage.message.messages.length >= 1) {
                // we load period messages as new array
                self.messages = []
                // display messages
                self.displayMessage(dataMessage.message.messages)
                // get last and first item
                var firstItem = self.messages[0]
                var lastItem = self.messages[self.messages.length - 1]
                // check if first and last element have ids
                if (typeof firstItem.id !== 'undefined') {
                  self.periodFirstId = firstItem.id
                }
                if (typeof lastItem.id !== 'undefined') {
                  self.periodLastId = lastItem.id
                }
              }
            }
          }
        },
        sendGuestRoomMessages: function (dataMessage, self) {
          if (parseInt(dataMessage.message.room.id) === parseInt(self.currentRoomID) && !self.withPeriod) {
            self.displayMessage(dataMessage.message.message)
          } else {
            if (self.withPeriod && parseInt(dataMessage.message.room.id) === parseInt(self.currentRoomID)) {
              self.sentMessage = true
            }
          }
          self.typingMessage = ''
        },
        getOnline: function (dataMessage, self) {
          self.onlineList = dataMessage.message.connections
          self.setOnlines(self.onlineList, true)
        },
        socketConnected: function (dataMessage, self) {
          self.getOnlines()
          // self.onlineList.concat(dataMessage.message)
          // self.setOnlines(self.onlineList, true)
        },
        onDisconnect: function (dataMessage, self) {
          self.setOnlines(dataMessage.message, false)
        },
        sendMessageRoom: function (dataMessage, self) {
          if (parseInt(dataMessage.message.room.id) === parseInt(self.currentRoomID) && !self.withPeriod) {
            self.displayMessage(dataMessage.message.message)
          } else {
            if (self.withPeriod && parseInt(dataMessage.message.room.id) === parseInt(self.currentRoomID)) {
              self.sentMessage = true
            }
          }
          self.typingMessage = ''
        },
        editMessage: function (dataMessage, self) {
          if (parseInt(dataMessage.message.room.id) === parseInt(self.currentRoomID)) {
            self.updateMessage(dataMessage.message)
            self.messageInput = ''
            self.messageEditing = false
          }
        },
        userIsTyping: function (dataMessage, self) {
          if (parseInt(self.currentRoomID) === parseInt(dataMessage.message.roomID)) {
            let userName = dataMessage.message.user.firstname + ' ' + dataMessage.message.user.lastname
            let data = {
              username: userName,
              message: dataMessage.message.message
            }
            // output user is typing
            var timeout
            if (self.typings.length === 0 && self.userIsTyping === false) {
              self.typingMessage = data.username + ' ' + data.message
              self.userIsTyping = true
              self.playTypingSound()
              // set timeout
              clearTimeout(timeout)
              timeout = setTimeout(function () {
                self.userIsTyping = false
                self.typingMessage = ''
              }, 2000)
            }
          }
        },
        guestIsTyping: function (dataMessage, self) {
          if (parseInt(self.currentRoomID) === parseInt(dataMessage.message.roomID)) {
            let messageGuest = dataMessage.message
            let userName = '(guest) '
            let guestID = ((messageGuest.guest.name != null) ? messageGuest.guest.name : (messageGuest.guest.email != null) ? messageGuest.guest.email : '#' + messageGuest.guest.id)
            let data = {
              username: userName + guestID,
              message: dataMessage.message.message
            }
            // output user is typing
            var timeout
            if (self.typings.length === 0 && self.userIsTyping === false) {
              self.typingMessage = data.username + ' ' + data.message
              self.userIsTyping = true
              self.playTypingSound()
              // set timeout
              clearTimeout(timeout)
              timeout = setTimeout(function () {
                self.userIsTyping = false
                self.typingMessage = ''
              }, 2000)
            }
          }
        }

      }

    }
  },
  mixins: [chatMixin,
    socketMixin,
    eventMixin,
    notificationMixin,
    handlerMixin,
    loaderMixin,
    displayMixin,
    uploadMixin,
    emojiMixin,
    globalNotificationMixin
  ],
  components: {
    message,
    chatMessages,
    emojiPicker,
    chatSettings
  },
  filters: {},
  watch: {
    messageInput: function (val, old) {
      if (this.currentRoomID !== 0) {
        this.inputLength++
        if (this.inputLength > 8) {
          var data = {
            event: 'userIsTyping',
            data: {
              roomID: this.currentRoomID
            }
          }

          this.sendSocketData(data)
          this.isLoading = false
          this.inputLength = 0
        }
      }
    }
  },
  sockets: {
    connect: function () {
    },
    disconnect: function () {
    },
    message: function (msg) {
      console.log(msg)
      // check events
      if (msg.event === 'auth') {
        if (msg.data.status === true) {
          // set auth for current user
          if (this.authRequested === false) {
            this.events['auth']('', this)
            this.globalNotification('Connecting ... ', 'success')
          }
        } else {
          this.globalNotification("Couldn't establish a connection !", 'error')
        }
      }

      if (msg.event === 'disconnect') {
        this.globalNotification(msg.message, 'error')
      }

      var self = this
      // check for msg data and events
      if (typeof msg.data !== 'undefined') {
        if (typeof msg.data.globalNotification !== 'undefined') {
          // globalNotification usually is an error notification
          // which doesn't allow a specific action
          this.leftRoom = 1
          this.globalNotification(msg.data.globalNotification.message, 'error')
          return false
        } else if (typeof msg.data.notification !== 'undefined') {
          // notification
          this.notifyUser(msg.data.notification)
        } else if (typeof msg.data.customNotification !== 'undefined') {
          // custom notification
          this.processEvents(msg.data.customNotification)
          setTimeout(function () {
            self.isLoading = false
          }, 500)
        } else {
          // link event
          if (!this.events[msg.event]) {
            return false
          }
          // check if event is not auth
          if (msg.event !== 'auth') {
            this.events[msg.event](msg.data, this)
          }
          setTimeout(function () {
            self.isLoading = false
          }, 500)
        }
      }
    }
  },
  mounted: function () {
    this.timezone = momentTz.tz.guess()
    this.authStatus = false
  },
  created: function () {
    // update page number emoji
    this.$store.dispatch('setCurrentEmojiPage', {page: parseInt(1)})
    // update page number message period
    this.$store.dispatch('setCurrentMessagePeriodPageUp', {page: parseInt(1)})
    // update page number message period
    this.$store.dispatch('setCurrentMessagePeriodPageDown', {page: parseInt(1)})
    // update chat settings
    this.$store.dispatch('setCurrentUserChatSettings', {})
    // get new emoji
    this.$store.dispatch('setCurrentEmoji', {})
    // set auth requested from page
    this.authRequested = this.returnAuthRequested

    var self = this
    // change visibility
    Visibility.change(function (e, state) {
      document.title = state
      self.pageState(state)
    })
    // if page component requested auth send event
    if (this.authRequested) {
      this.globalNotification('Connecting ... ', 'success')
      this.events['auth']('', this)
    }
  },
  updated: function () {
    var self = this
    // listen scroll rooms
    let windowRooms = this.$refs.roomcontainer
    if (windowRooms) {
      windowRooms.addEventListener('scroll', () => {
        this.roomsBottom = this.bottomRoomsVisible()
        if (this.roomsBottom) {
          this.loadRooms(this.currentRoomPage, 10)

          this.$nextTick(function () {
            let container = self.$refs.roomcontainer
            container.scrollTo(0, self.pageHeightRoom)
          })
        }
      })
    }
    // listen scroll departments
    let windowDepartments = this.$refs.departmentsList
    if (windowDepartments) {
      windowDepartments.addEventListener('scroll', () => {
        this.departmentsBottom = this.bottomDepartmentsVisible()
        if (this.departmentsBottom) {
          this.loadDepartments(this.currentDepartmentsPage, 5)

          this.$nextTick(function () {
            let container = self.$refs.departmentsList
            container.scrollTo(0, self.pageHeightDepartments)
          })
        }
      })
    }
    // listen scroll left room
    let windowLeftRooms = this.$refs.leftRoomList
    if (windowLeftRooms) {
      windowLeftRooms.addEventListener('scroll', () => {
        this.leftRoomBottom = this.bottomLeftRoomVisible()
        if (this.leftRoomBottom) {
          this.loadLeftRoomUsers(this.currentRoomSettings, this.currentLeftRoomPage, 5)

          this.$nextTick(function () {
            let container = self.$refs.leftRoomList
            container.scrollTo(0, self.pageHeightLeftRooms)
          })
        }
      })
    }
    // listen scroll employees
    let windowEmployees = this.$refs.employeecontainer
    if (windowEmployees) {
      windowEmployees.addEventListener('scroll', () => {
        this.employeesBottom = this.bottomEmployeesVisible()
        if (this.employeesBottom) {
          this.loadEmployees(this.currentEmployeePage, 5)

          this.$nextTick(function () {
            let container = self.$refs.employeecontainer
            container.scrollTo(0, self.pageHeightEmployees)
          })
        }
      })
    }
    // listen scroll guests
    let windowGuests = this.$refs.guestcontainer
    if (windowGuests) {
      windowGuests.addEventListener('scroll', () => {
        this.guestsBottom = this.bottomGuestsVisible()
        if (this.guestsBottom) {
          this.loadGuests(this.currentGuestPage, 5)

          this.$nextTick(function () {
            let container = self.$refs.guestcontainer
            container.scrollTo(0, self.pageHeightGuests)
          })
        }
      })
    }
    // listen scroll chat invites
    let windowChatInvites = this.$refs.inviteContainer
    if (windowChatInvites) {
      windowChatInvites.addEventListener('scroll', () => {
        this.chatInvitesBottom = this.bottomChatInvitesVisible()
        if (this.chatInvitesBottom) {
          this.loadChatInvites(this.currentChatInvitePage, 10)

          this.$nextTick(function () {
            let container = self.$refs.inviteContainer
            container.scrollTo(0, self.pageHeightChatInvites)
          })
        }
      })
    }
    // listen scroll create room
    let windowCreateRoom = this.$refs.inivteUsersList
    if (windowCreateRoom) {
      windowCreateRoom.addEventListener('scroll', () => {
        this.createRoomBottom = this.bottomCreateRoomVisible()
        if (this.createRoomBottom) {
          this.loadEmployees(this.currentEmployeePage, 5)

          this.$nextTick(function () {
            let container = self.$refs.inivteUsersList
            container.scrollTo(0, self.pageHeightCreateRoom)
          })
        }
      })
    }
  },
  methods: {
    switchPeriod: function (period) {
      let data = {switchPeriod: true, to: period}
      this.switchPeriodData = data
    },
    showEmojiPicker: function () {
      if (this.emojiPick) {
        this.isLoading = false
        this.emojiPick = false
      } else {
        this.isLoading = true
        this.emojiPick = true
      }
      this.customEmoji = []
      // update page number
      this.$store.dispatch('setCurrentEmojiPage', {page: parseInt(1)})
    },
    onEmojiSelect: function (val) {
      let messageInput = this.$refs.messageInput
      let cursorPosition = messageInput.selectionStart
      let inputValue = this.messageInput
      let newValue = inputValue.substring(0, cursorPosition) + val + inputValue.substring(cursorPosition)
      this.messageInput = newValue
    },
    onClosePicker: function (val) {
      this.emojiPick = val
      this.customEmoji = []
      // update page number
      this.$store.dispatch('setCurrentEmojiPage', {page: parseInt(1)})
    },
    showHideSettings: function () {
      if (this.showSettings) {
        this.showSettings = false
      } else {
        this.showSettings = true
      }
    },
    bottomRoomsVisible () {
      let windowRooms = this.$refs.roomcontainer
      let scrollY = windowRooms.scrollTop
      let visible = windowRooms.clientHeight
      let pageHeight = windowRooms.scrollHeight
      let bottomOfPage = visible + (scrollY + 10) >= pageHeight

      if (!this.lastScrollRoom && bottomOfPage) {
        this.lastScrollRoom = true
        this.pageHeightRoom = pageHeight
        return true
      } else if (this.lastScrollRoom && bottomOfPage) {
        this.lastScrollRoom = true
        return false
      } else if (!bottomOfPage) {
        this.lastScrollRoom = false
        return false
      }

      return bottomOfPage || pageHeight < visible
    },
    bottomEmployeesVisible () {
      let windowEmployees = this.$refs.employeecontainer
      let scrollY = windowEmployees.scrollTop
      let visible = windowEmployees.clientHeight
      let pageHeight = windowEmployees.scrollHeight
      let bottomOfPage = visible + (scrollY + 10) >= pageHeight

      if (!this.lastScrollEmployees && bottomOfPage) {
        this.lastScrollEmployees = true
        this.pageHeightEmployees = pageHeight
        return true
      } else if (this.lastScrollEmployees && bottomOfPage) {
        this.lastScrollEmployees = true
        return false
      } else if (!bottomOfPage) {
        this.lastScrollEmployees = false
        return false
      }

      return bottomOfPage || pageHeight < visible
    },
    bottomDepartmentsVisible () {
      let windowDepartments = this.$refs.departmentsList
      let scrollY = windowDepartments.scrollTop
      let visible = windowDepartments.clientHeight
      let pageHeight = windowDepartments.scrollHeight
      let bottomOfPage = visible + (scrollY + 10) >= pageHeight

      if (!this.lastScrollDepartments && bottomOfPage) {
        this.lastScrollDepartments = true
        this.pageHeightDepartments = pageHeight
        return true
      } else if (this.lastScrollDepartments && bottomOfPage) {
        this.lastScrollDepartments = true
        return false
      } else if (!bottomOfPage) {
        this.lastScrollDepartments = false
        return false
      }

      return bottomOfPage || pageHeight < visible
    },
    bottomLeftRoomVisible () {
      let windowLeftRooms = this.$refs.leftRoomList
      let scrollY = windowLeftRooms.scrollTop
      let visible = windowLeftRooms.clientHeight
      let pageHeight = windowLeftRooms.scrollHeight
      let bottomOfPage = visible + (scrollY + 10) >= pageHeight

      if (!this.lastScrollLeftRooms && bottomOfPage) {
        this.lastScrollLeftRooms = true
        this.pageHeightLeftRooms = pageHeight
        return true
      } else if (this.lastScrollLeftRooms && bottomOfPage) {
        this.lastScrollLeftRooms = true
        return false
      } else if (!bottomOfPage) {
        this.lastScrollLeftRooms = false
        return false
      }

      return bottomOfPage || pageHeight < visible
    },
    bottomGuestsVisible () {
      let windowGuests = this.$refs.guestcontainer
      let scrollY = windowGuests.scrollTop
      let visible = windowGuests.clientHeight
      let pageHeight = windowGuests.scrollHeight
      let bottomOfPage = visible + (scrollY + 10) >= pageHeight

      if (!this.lastScrollGuests && bottomOfPage) {
        this.lastScrollGuests = true
        this.pageHeightGuests = pageHeight
        return true
      } else if (this.lastScrollGuests && bottomOfPage) {
        this.lastScrollGuests = true
        return false
      } else if (!bottomOfPage) {
        this.lastScrollGuests = false
        return false
      }

      return bottomOfPage || pageHeight < visible
    },
    bottomChatInvitesVisible () {
      let windowChatInvites = this.$refs.inviteContainer
      let scrollY = windowChatInvites.scrollTop
      let visible = windowChatInvites.clientHeight
      let pageHeight = windowChatInvites.scrollHeight
      let bottomOfPage = visible + (scrollY + 10) >= pageHeight

      if (!this.lastScrollChatInvites && bottomOfPage) {
        this.lastScrollChatInvites = true
        this.pageHeightChatInvites = pageHeight
        return true
      } else if (this.lastScrollChatInvites && bottomOfPage) {
        this.lastScrollChatInvites = true
        return false
      } else if (!bottomOfPage) {
        this.lastScrollChatInvites = false
        return false
      }

      return bottomOfPage || pageHeight < visible
    },
    bottomCreateRoomVisible () {
      let windowCreateRoom = this.$refs.inivteUsersList
      let scrollY = windowCreateRoom.scrollTop
      let visible = windowCreateRoom.clientHeight
      let pageHeight = windowCreateRoom.scrollHeight
      let bottomOfPage = visible + (scrollY + 10) >= pageHeight

      if (!this.lastScrollCreateRoom && bottomOfPage) {
        this.lastScrollCreateRoom = true
        this.pageHeightCreateRoom = pageHeight
        return true
      } else if (this.lastScrollCreateRoom && bottomOfPage) {
        this.lastScrollCreateRoom = true
        return false
      } else if (!bottomOfPage) {
        this.lastScrollCreateRoom = false
        return false
      }

      return bottomOfPage || pageHeight < visible
    },
    setSendSaveMessage () {
      if (this.messageEditing === false) {
        this.sendMessage()
      } else if (this.messageEditing === true) {
        this.saveMessage()
      }
    },
    setCurrentRoomData: function (data, type) {
      switch (type) {
        case 'employee':
          this.currentRoomData = []
          this.currentUserData = data
          this.currentGuestData = []
          break
        case 'room':
          this.currentRoomData = data
          this.currentUserData = []
          this.currentGuestData = []
          break
        case 'guest':
          this.currentRoomData = []
          this.currentUserData = []
          this.currentGuestData = data
          break
        default:
          break
      }
    },
    saveMessage () {
      let oldMessageIndex = this.oldMessageIndex
      if (this.messages[oldMessageIndex] && this.messages[oldMessageIndex].message !== this.messageInput) {
        var data = {
          event: 'editMessage',
          data: {
            newMessage: this.messageInput,
            data: this.messages[oldMessageIndex]
          }
        }
        this.sendSocketData(data)
        this.messageInput = ''
        this.messageEditing = false
      }
    },
    notify () {
      this.$notification.show('Notify', {
        body: 'This is an example!',
        icon: 'https://d30y9cdsu7xlg0.cloudfront.net/png/65535-200.png'
      }, {})
    },
    onHideSettings: function (val) {
      this.showSettings = val
    },
    status: function (status) {
      return (status === true) ? 'online' : 'offline'
    },
    eventInput: function (val) {
      this.messageInput = val
    },
    eventWithPeriod: function (val) {
      this.withPeriod = val
    },
    eventPeriods: function (val) {
      this.periodUp = val.periodUp
      this.periodDown = val.periodDown
      this.withPeriod = val.withPeriod
    },
    eventWasSwitched: function (val) {
      this.messages = []
      this.currentMessagePage = 1
      this.withPeriod = false
      this.periodUp = false
      this.periodDown = false
      this.sentMessage = false
      this.loadMessages()
    },
    eventEditing: function (val) {
      this.messageEditing = val
    },
    eventOldIndex: function (val) {
      this.oldMessageIndex = val
    },
    eventLoadMore: function (val) {
      this.loadMoreMessages = val
    },
    event: function (val) {
      this.oldMessageIndex = val
    },
    onLoading: function (val) {
      this.isLoading = val
    },
    eventMessagesLoaded: function (val) {
    },
    validateRequest: function (dataMessage) {
      if (typeof dataMessage.message.init !== 'undefined') {
        let reqSocket = dataMessage.message.init
        let currentSocket = this.$socket.id
        // check if connection socket and request socket are same
        if (reqSocket !== currentSocket) {
          return false
        }
      }
      return true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'skeleton-css/css/skeleton.css';
@import url('https://fonts.googleapis.com/css?family=Montserrat|Raleway');
.currentTimestamp{
  margin-left: 45%;
  font-weight: bold;
  cursor: pointer;
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
    margin-top: 15px;
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

.redirectPeriod {
  cursor: pointer;
  text-decoration: underline;
}

.departmentsContainer {
  min-height: 200px;
  height: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.departmentsContainer::-webkit-scrollbar {
  width: 5px;
}

.departmentsContainer::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: #555;
}

.departmentsContainer::-webkit-scrollbar-track {
  border-radius: 10px;
}

.leftRoomContainer {
  min-height: 200px;
  height: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.leftRoomContainer::-webkit-scrollbar {
  width: 5px;
}

.leftRoomContainer::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: #555;
}

.leftRoomContainer::-webkit-scrollbar-track {
  border-radius: 10px;
}

.input-box-msg{
  height: 100px
}

.chat-scroll-container{
  /* height: 550px; */
  /* min-height: 550px; */
  padding: 1em;
  overflow-x: hidden;
  overflow-y: hidden;
    border-bottom: 1px solid #ccc;
}

.chat-input-container{
  height: 80px;
  min-height: 80px;
  padding: 1em;
}

.height-500{
  height: 500px;
}

.searchTitle {
  width: 80%;
}

</style>
<style scoped="scss" src="@/assets/chatVue.css"></style>
