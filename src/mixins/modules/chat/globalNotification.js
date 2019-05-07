import messageBox from '../notifications/message'

export default {
  methods: {
    globalNotification (message, type) {
      switch (type) {
        case 'success':
          messageBox.success(message)
          break
        case 'warning':
          messageBox.warning(message)
          break
        case 'error':
          messageBox.warning(message)
          break
        case 'info':
          messageBox.warning(message)
          break
        default: break
      }
    }
  }
}
