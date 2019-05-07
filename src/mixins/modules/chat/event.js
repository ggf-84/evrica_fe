export default {
  data () {
    return {
      processedEvents: {
        roomLeft: function (dataMessage, self) {
          self.roomLeft(dataMessage)
        },
        roomDeleted: function (dataMessage, self) {
          self.roomDeleted(dataMessage)
        },
        roomCreated: function (dataMessage, self) {
          self.roomCreated(dataMessage)
        },
        newContact: function (dataMessage, self) {
          self.newContact(dataMessage)
        },
        inviteAccepted: function (dataMessage, self) {
          self.inviteAccepted(dataMessage)
        },
        inviteDeclined: function (dataMessage, self) {
          self.inviteDeclined(dataMessage)
        }
      }
    }
  },
  methods: {
    processEvents: function (event) {
      if (!this.processedEvents[event.name]) {
        console.log('unknown event or event not defined')
        return false
      }
      this.processedEvents[event.name](event, this)
    },
    roomLeft: function (data) {
      var onElementRoom = {roomID: data.room.id, userID: data.user.id}
      this.updateUnreadMessagesCounter('room', onElementRoom, false)
      this.currentChatInvitePage = 1
      this.loadChatInvites(this.currentChatInvitePage, 10)
    },
    roomDeleted: function (data) {
      if (data.message.status.room === true) {
        this.resetCurrentData(data.room.id)
        if (this.roomArrayIndex !== null) {
          this.$delete(this.rooms, this.roomArrayIndex)
        } else {
          this.rooms.map((e, i) => {
            if (parseInt(e.room_id) === parseInt(data.room.id)) {
                // delete room
              this.$delete(this.rooms, this.rooms.indexOf(this.rooms[i]))
            }
          })
        }
      }
    },
    inviteAccepted: function (data) {
      if (typeof data.message.id !== 'undefined') {
        this.$delete(this.invites, this.inviteArrayIndex)
        this.currentChatInvitePage = 1
        this.totalInvites -= 1
      }
    },
    inviteDeclined: function (data) {
      if (typeof data.message.id !== 'undefined') {
        this.$delete(this.invites, this.inviteArrayIndex)
        this.currentChatInvitePage = 1
        this.totalInvites -= 1
      }
    },
    roomCreated: function (data) {
      if (data.room.id !== null) {
        this.currentRoomPage = 1
        this.rooms = []
        this.loadRooms(this.currentRoomPage, 10)
      }
      this.currentChatInvitePage = 1
      this.invites = []
      this.loadChatInvites(this.currentChatInvitePage, 10)
    },
    resetCurrentData: function (id) {
      let currentRoom = this.currentRoomID
      if (currentRoom === id) {
        this.currentRoomData = []
        this.currentMessagePage = 1
        this.messages = []
        this.moreMessages = []
      }
    },
    newContact: function (data) {
      if (data.room.id !== null) {
        this.currentEmployeePage = 1
        this.employees = []
        if (this.newContactReq) {
          this.joinRoom(data.room.id)
        }
        this.loadEmployees(this.currentEmployeePage, 5)
        this.getOnlines()
      }
    },
    sendEventUserID: function () {
      var data = { 'event': 'sendEventUserID', 'data': { userID: this.eventuser } }

      this.$socket.json.send(data)
    }
  }
}
