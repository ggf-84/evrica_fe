export default {
  methods: {
    attachementSuccess: function (data) {
      this.currentTask.attachments.push(data.data)
    },
    updateAttachementName: function (data) {
      // send event to ws server
      let request = {
        event: 'updateAttachmentTitle',
        data: {
          name: data.name,
          id: data.id
        }
      }

      this.$socket.json.send(request)
    },
    removeAttachment: function (data) {
      let request = {
        event: 'removeAttachment',
        data: {
          id: data.id
        }
      }

      let ind = this.currentTask.attachments.indexOf(data)

      if (ind > -1) {
        this.currentTask.attachments.splice(ind, 1)
      }

      this.$socket.json.send(request)
    }
  }
}
