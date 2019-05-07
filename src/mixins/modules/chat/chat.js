import moment from 'moment'
import notifiction from '../notifications/notification'

export default {
  methods: {
    moment: function (date) {
      return moment(date)
    },
    setupEmployeeRoom: function (id) {
      var data = { event: 'setupEmployeeRoom', data: { employeeID: id } }
      this.sendSocketData(data)
    },
    joinRoom: function (id, referrerID = null) {
      this.loadMoreMessages = false
      var data
      if (referrerID !== null) {
        this.newContactReq = true
        data = { event: 'joinRoomChat', data: { roomID: id, referrer: referrerID } }
      } else {
        data = { event: 'joinRoomChat', data: { roomID: id } }
      }
      this.sendSocketData(data)
      this.messages = []
      this.typings = []
      this.currentRoomID = id
      this.withPeriod = false
      this.PeriodUp = false
      this.PeriodDown = false
      // update room id in store
      this.$store.dispatch('setCurrentRoomID', {roomID: parseInt(id)})
      this.currentMessagePage = 1
    },
    leaveRoom: function (id, index) {
      var data = { event: 'leaveRoom', data: { roomID: id } }
      this.sendSocketData(data)
    },
    deleteRoom: function (data) {
      let indx = this.rooms.indexOf(data)
      if (indx > -1) {
        var dataSend = { event: 'deleteRoom', data: { roomID: this.rooms[indx].room_id } }
        this.sendSocketData(dataSend)
        this.roomArrayIndex = indx
        this.roomDelete = ''
      }
    },
    sendMessage: function () {
      this.messageInput = this.messageInput.trim()
      if (this.currentRoomID !== 0 && this.messageInput && this.messageInput.length) {
        var data = { event: 'sendMessageRoom', data: { roomID: this.currentRoomID, message: this.messageInput } }
        this.sendSocketData(data)
        this.messageInput = ''
        this.sentMessage = true
      }
    },
    pageState: function (state) {
      if (state === 'visible') {
        this.visiblePage = true
      } else {
        this.visiblePage = false
      }
    },
    updateUnreadMessagesCounter: function (type, element, action) {
      switch (type) {
        case 'employee':
          this.employees.map((e, i) => {
            if (parseInt(e.room_id) === parseInt(element.roomID)) {
            // type is true increment with +1
              if (action === true) {
                this.employees[i].unread = parseInt(this.employees[i].unread + 1)
              } else {
              // else set to 0
                this.employees[i].unread = 0
              }
            }
          })
          break
        case 'room':
          this.rooms.map((e, i) => {
            if (parseInt(e.room_id) === parseInt(element.roomID)) {
          // type is true increment with +1
              if (action === true) {
                this.rooms[i].unread = parseInt(this.rooms[i].unread + 1)
              } else {
            // else set to 0
                this.rooms[i].unread = 0
              }
            }
          })
          break
        case 'guest':
          this.guests.map((e, i) => {
            if (parseInt(e.room_id) === parseInt(element.roomID)) {
          // type is true increment with +1
              if (action === true) {
                this.guests[i].unread = parseInt(this.guests[i].unread + 1)
              } else {
            // else set to 0
                this.guests[i].unread = 0
              }
            }
          })
          break
        default:
      }
    },

    updateMessage: function (element) {
      // var item
      this.messages.forEach(function (e, i) {
        if (parseInt(e.id) === parseInt(element.message.id)) {
          e.message = element.message.message
          e.is_edited = element.message.is_edited
        }
      })

      // if (item) {
      //   this.messages[item].message = element.message.message
      //   this.messages[item].is_edited = element.message.is_edited
      //   let newMessage = this.messages[item]
      //   this.$delete(this.messages, item)
      //   this.messages.concat(newMessage)
      //   console.log(newMessage)
      //   // console.log(this.messages[item])
      //   // let k = this.messages[item]
      //   // Vue.set(this.messages, item, k)
      // }
    },
    updateUnreadCounter: function (type, roomID, userID = null) {
      // identify where counter needs to be updated
      switch (type) {
        case 'employee':
          var onElementEmployee = {roomID: roomID, userID: userID}
          this.updateUnreadMessagesCounter(type, onElementEmployee, false)
          break

        case 'room':
          var onElementRoom = {roomID: roomID}
          this.updateUnreadMessagesCounter(type, onElementRoom, false)
          break

        case 'guest':
          var onElementGuest = {roomID: roomID}
          this.updateUnreadMessagesCounter(type, onElementGuest, false)
          break

        default:
          console.log('#')
      }
    },
    getOnlines: function () {
      var data = { event: 'getOnline', data: {} }
      this.sendSocketData(data)
    },
    setOnlines: function (onlines, status) {
      var i
      for (i = 0; i < onlines.length; i++) {
        this.updateOnlineStatus(onlines[i], status)
      }
    },
    getRoomsByTitle: function () {
      let title = this.roomSearchTitle
      title = title.trim()
      if (title && title.length) {
        this.rooms = []
        this.currentRoomPage = 1
        // set offset and limit to rooms
        var data = { event: 'getRooms', data: { page: this.currentRoomPage, limit: this.currentRoomLimit, query: this.roomSearchTitle } }
        this.sendSocketData(data)
      }
    },
    getEmployeesByName: function () {
      let title = this.employeeSearchTitle
      title = title.trim()
      if (title && title.length) {
        this.employees = []
        this.currentEmployeePage = 1
        // set offset and limit to rooms
        var data = { event: 'getEmployees', data: { page: this.currentEmployeePage, limit: this.currentEmployeeLimit, query: this.employeeSearchTitle } }
        this.sendSocketData(data)
      }
    },
    getGuestsByTitle: function () {
      let title = this.guestSearchTitle
      title = title.trim()
      if (title && title.length) {
        this.guests = []
        this.currentGuestPage = 1
        // set offset and limit to rooms
        var data = { event: 'getGuests', data: { page: this.currentGuestPage, limit: this.currentGuestLimit, query: this.guestSearchTitle } }
        this.sendSocketData(data)
      }
    },
    updateOnlineStatus: function (element, status) {
      let parseUserID = (element) ? parseInt(element.user_id) : 0
      let parseGuestID = (element) ? parseInt(element.guest_id) : 0
      if (parseUserID !== 0) {
        this.employees.map((e, i) => {
          if (element.user_id && e.user_id) {
            if (parseInt(e.user_id) === parseInt(element.user_id)) {
              if (status === true) {
                e.online = status
              } else {
                e.online = status
              }
            }
          }
          return e
        })
      } else if (parseGuestID !== 0) {
        this.guests.map((e, i) => {
          if (element.guest_id && e.guest_id) {
            if (parseInt(e.guest_id) === parseInt(element.guest_id)) {
              if (status === true) {
                e.online = status
              } else {
                e.online = status
              }
            }
          }
          return e
        })
      }
    },
    createRoomDepartment: function () {
      let departments = this.checkListDepartments

      if (departments.length >= 1) {
        let ids = departments
        var data = { event: 'createRoomDepartment', data: {ids: ids} }
        this.sendSocketData(data)
        this.dialogDepartmentVisible = false
        this.dialogVisible = false
      } else {
        notifiction.error('System !', 'Select 1 or more department')
      }
    },
    inviteBack: function () {
      let users = this.checkListLeftRoom

      if (users.length >= 1) {
        let ids = users
        var data = { event: 'inviteBack', data: {ids: ids, id: this.currentRoomSettings} }
        this.sendSocketData(data)
        this.deleteRoomSettingDialog = false
      } else {
        notifiction.error('System !', 'Select 1 or more users')
      }
    }
  }
}
