
export default {
  methods: {
    displayRooms: function (rooms) {
      this.rooms = this.rooms.concat(rooms)
      if (rooms.length >= 1) {
        this.currentRoomPage++
      }
    },
    displayChatInvites: function (invites) {
      this.invites = this.invites.concat(invites)
      if (invites.length >= 1) {
        this.currentChatInvitePage++
      }
    },
    displayDepartments: function (departments) {
      this.departments = this.departments.concat(departments)
      if (departments.length >= 1) {
        this.currentDepartmentsPage++
      }
    },
    displayLeftRoomUsers: function (users) {
      this.leftRoomUsers = this.leftRoomUsers.concat(users)
      if (users.length >= 1) {
        this.currentLeftRoomPage++
      }
    },
    displayEmployees: function (employees) {
      this.employees = this.employees.concat(employees)
      if (employees.length >= 1) {
        this.currentEmployeePage++
      }
      this.getOnlines()
    },
    displayGuests: function (guests) {
      this.guests = this.guests.concat(guests)
      if (guests.length >= 1) {
        this.currentGuestPage++
      }
      this.getOnlines()
    },
    displayMessages: function (messages, direction = null) {
      // scroll and add messages
      let old = this.messages
      this.messages = messages
      // check if messages loaded with period
      if (this.withPeriod) {
        // if period scrolled up
        if (this.periodUp === true && this.periodDown === false) {
          // without period
          if (old.length > 0) {
            this.messages = messages.concat(old)
          }
        } else if (this.periodUp === false && this.periodDown === true) {
          this.messages = old.concat(messages)
        } else {
          // without period
          if (old.length > 0) {
            this.messages = messages.concat(old)
          }
        }
      } else {
        // without period
        if (old.length > 0) {
          this.messages = messages.concat(old)
        }
      }
      // set messages page
      if (this.currentMessagePage >= 1 && this.loadMoreMessages === true && messages.length >= 1) {
        this.currentMessagePage++
      } else if (this.currentMessagePage === 1) {
        this.currentMessagePage = 2
      }
      // mark as read
      var data = { event: 'readMessageRoom', data: {roomID: this.currentRoomID} }
      this.sendSocketData(data)
    },
    displayMessage: function (messages) {
      this.messages = this.messages.concat(messages)
      // mark as read
      var data = { event: 'readMessageRoom', data: {roomID: this.currentRoomID} }
      this.sendSocketData(data)
    }
  }
}
