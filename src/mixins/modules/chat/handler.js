export default {
  methods: {
    handleClose (done) {
      this.$confirm('Are you sure to close this dialog?')
            .then(_ => {
              done()
            })
            .catch(_ => {})
    },
    handleClick (tab, event) {
    },
    chatInvite: function () {
      if (this.checkList.length >= 2) {
        this.dialogVisible = false
        var data = { event: 'createRoom', data: {ids: this.checkList, title: this.roomNameInput} }
        this.sendSocketData(data)
      } else {
        let errorMessage = 'Please , select two users or more'
        let data = {room: {id: -1}, status: false, message: errorMessage}
        this.notifyUser(data)
      }
    },
    acceptInvite: function (id, index) {
      this.inviteArrayIndex = index
      var data = { event: 'acceptInvite', data: {roomID: id} }
      this.sendSocketData(data)
    },
    declineInvite: function (id, index) {
      this.inviteArrayIndex = index
      var data = { event: 'declineInvite', data: {roomID: id} }
      this.sendSocketData(data)
    }
  }
}
