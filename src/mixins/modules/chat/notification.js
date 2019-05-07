import notifiction from '../notifications/notification'
import soundMixin from './sound.js'

export default {
  mixins: [
    soundMixin
  ],
  methods: {
    notifyUser: function (data) {
      if (data.room === null || parseInt(data.room.id) !== parseInt(this.currentRoomID) || this.visiblePage === false || data.status === false) {
        if (this.visiblePage === true) {
          if (data.status === false) {
            notifiction.error('System !', data.message)
          } else {
            notifiction.success('System !', data.message)
          }
          this.playNotificationSound()
        } else {
          this.$notification.show('Notify', {
            body: data.message,
            icon: 'https://d30y9cdsu7xlg0.cloudfront.net/png/65535-200.png'
          }, {})
          this.playNotificationSound()
        }

        // identify if room is private (one - one user conversation) or public
        if (data.room !== null && parseInt(data.room.is_default) === 0 && parseInt(data.room.id) !== parseInt(this.currentRoomID)) {
          if (data.isCounter === true) {
            var onElementEmployee = {roomID: parseInt(data.room.id), userID: parseInt(data.user.id)}
            this.updateUnreadMessagesCounter('employee', onElementEmployee, true)
          }
        } else {
          if (data.isCounter === true && parseInt(data.room.is_guest) === 0 && parseInt(data.room.id) !== parseInt(this.currentRoomID)) {
            var onElementRoom = {roomID: parseInt(data.room.id), userID: parseInt(data.user.id)}
            this.updateUnreadMessagesCounter('room', onElementRoom, true)
          } else if (data.isCounter === true && parseInt(data.room.is_guest) === 1 && parseInt(data.room.id) !== parseInt(this.currentRoomID)) {
            var onElementGuest = {roomID: parseInt(data.room.id)}
            this.updateUnreadMessagesCounter('guest', onElementGuest, true)
          }
        }
      }
    }
  }
}
