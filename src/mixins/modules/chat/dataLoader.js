export default {
  methods: {
    loadRooms: function (offset, amount) {
      var data
      let title = this.roomSearchTitle
      title = title.trim()
      if (title && title.length) {
        // set offset and limit to rooms
        data = { event: 'getRooms', data: { page: offset, limit: amount, query: this.roomSearchTitle } }
      }
      // set offset and limit to rooms
      data = { event: 'getRooms', data: { page: offset, limit: amount } }
      this.sendSocketData(data)
    },
    loadEmployees: function (offset, amount) {
      var data
      let title = this.employeeSearchTitle
      title = title.trim()
      if (title && title.length) {
        // set offset and limit to rooms
        data = { event: 'getEmployees', data: { page: offset, limit: amount, query: this.employeeSearchTitle } }
      }
      // set offset and limit to employees
      data = { event: 'getEmployees', data: { page: offset, limit: amount } }
      this.sendSocketData(data)
    },
    loadGuests: function (offset, amount) {
      var data
      let title = this.guestSearchTitle
      title = title.trim()
      if (title && title.length) {
        // set offset and limit to rooms
        data = { event: 'getGuests', data: { page: offset, limit: amount, query: this.guestSearchTitle } }
      }
      // set offset and limit to employees
      data = { event: 'getGuests', data: { page: offset, limit: amount } }
      this.sendSocketData(data)
    },
    loadDepartments: function (offset, amount) {
      // set offset and limit to employees
      var data = { event: 'getDepartments', data: { page: offset, limit: amount } }
      this.sendSocketData(data)
    },
    loadLeftRoomUsers: function (id, offset, amount) {
      if (parseInt(id) !== 0) {
        // set offset and limit to employees
        var data = { event: 'getLeftRoomUsers', data: { id: id, page: offset, limit: amount } }
        this.sendSocketData(data)
      }
    },
    loadMessagesByPeriod: function (period, text) {
      if (period === 'today') {
        this.data = []
        this.currentMessagePage = 1
        this.withPeriod = false
        this.resetOffset()
        this.loadMessages(true)
      } else {
        // reset offset
        this.currentPeriodPageUp = 1
        this.currentPeriodPageDown = 1
        this.$store.dispatch('setCurrentMessagePeriodPageDown', {page: parseInt(1)})
        this.$store.dispatch('setCurrentMessagePeriodPageUp', {page: parseInt(1)})
        // set data
        this.currentMessagePage = 0
        let offset = 1
        let amount = this.currentMessageLimitPeriod
        let id = this.currentRoomID

        let data = { event: 'getMessagesByPeriod', data: {roomID: id, page: offset, limit: amount, jump: period} }

        this.sendSocketData(data)

        this.withPeriod = true
        this.fullReload = true
        this.dialogVisibleDate = false
        this.displayPeriodText = text
        this.$emit('changeWithPeriod', true)
      }
    },
    loadMessages: function (switched = false) {
      if (switched) {
        this.$emit('wasSwitched', switched)
      } else {
        this.showRoomMessages(this.currentRoomID, this.currentMessagePage, 15)
        this.loadMoreMessages = true
      }
    },
    loadMessagesByDirection: function (direction = null) {
      this.fullReload = false
      if (direction !== null && parseInt(this.periodLastId) !== 0 && parseInt(this.periodFirstId) !== 0) {
        let offset = (direction === 'up') ? this.getCurrentMessagePeriodPageUp : (direction === 'down') ? this.getCurrentMessagePeriodPageDown : null
        let amount = 15
        let id = this.currentRoomID
        let msgID = (direction === 'up') ? this.periodFirstId : (direction === 'down') ? this.periodLastId : null

        if (msgID !== null) {
          let data = { event: 'getMessagesByDirection',
            data: {roomID: id, page: offset, limit: amount, direction: direction, messageID: msgID}
          }

          this.sendSocketData(data)
        } else {
          this.loadMessages()
        }
      } else {
        this.loadMessages(true)
      }
    },
    showRoomMessages: function (id, offset, amount, limitID = null) {
      var data = ''
      if (limitID !== null) {
        data = { event: 'showRoomMessages', data: {roomID: id, page: offset, limit: amount, limitID: limitID} }
      } else {
        data = { event: 'showRoomMessages', data: {roomID: id, page: offset, limit: amount} }
      }

      this.sendSocketData(data)
    },
    loadChatInvites: function (offset, amount) {
      // reset invites array
      if (parseInt(offset) === 1) {
        this.invites = []
      }
      // set offset and limit to invites
      var data = { event: 'getInvites', data: { page: offset, limit: amount } }
      this.sendSocketData(data)
    }
  }
}
