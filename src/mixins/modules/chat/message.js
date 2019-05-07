import Vue from 'vue'
export default {
  methods: {
    editMessage: function (data) {
      let messageData = data.message
      this.oldMessageIndex = this.messages.indexOf(data)
      this.messageInput = messageData
      this.messageEditng = true
    },
    deleteMessage: function (data) {
      let indx = this.messages.indexOf(data)
      if (indx > -1) {
        // console.log(this.messages[indx])
        let data = { event: 'deleteMessage', data: { data: this.messages[indx] } }
        this.sendSocketData(data)
        this.$delete(this.messages, indx)
      }
    },
    saveMessage: function () {
      let oldMessageIndex = this.oldMessageIndex
      if (this.messages[oldMessageIndex] && this.messages[oldMessageIndex].message !== this.messageInput) {
        var data = { event: 'editMessage', data: { newMessage: this.messageInput, data: this.messages[oldMessageIndex] } }
        this.sendSocketData(data)
        this.messageInput = ''
        this.messageEditng = false
      }
    },
    updateMessage: function (element) {
      let item
      this.messages.forEach(function (e, i) {
        if (parseInt(e.id) === parseInt(element.message.id)) {
          item = i
        }
      })
      //  console.log(i + 'key' + parseInt(e.id) === parseInt(element.message.id))
      if (item) {
        console.log('-------------')
        console.log(item)
        this.messages[item].message = element.message.message
        this.messages[item].is_edited = element.message.is_edited
        let k = this.messages[item]
        Vue.set(this.messages, item, k)
      }
    }
  }
}
