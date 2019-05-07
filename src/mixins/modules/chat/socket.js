export default {
  methods: {
    sendSocketData: function (data) {
      this.$socket.json.send(data)
      this.isLoading = true
      var self = this
      setTimeout(function () {
        self.isLoading = false
      }, 1000)
    }
  }
}
