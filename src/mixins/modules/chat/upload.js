export default {
  methods: {
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    handleExceed (files, fileList) {
      this.$message.warning(`The limit is 8, you selected ${files.length} files this time, add up to 8 totally`)
    },
    beforeRemove (file, fileList) {
      // return this.$confirm(` ${file.name}？`)
    },
    handleSuccess: function (response, file, fileList) {
      let uploadedFiles = response.data.length
      if (uploadedFiles >= 1) {
        var data = { event: 'sendMessageRoom', data: { roomID: this.currentRoomID, message: this.messageInput, data: response.data } }
        this.sendSocketData(data)
      }
    }
  }
}
