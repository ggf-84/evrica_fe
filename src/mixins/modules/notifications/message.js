import { Message } from 'element-ui'

// docs: http://element.eleme.io/#/en-US/component/message

// How to import
// import message from '../../mixins/modules/notifications/message'

// How to use
// message.warning('New Notification!')

export default {
  success: (message) => {
    return Message({message: message, type: 'success'})
  },
  warning: (message) => {
    return Message({message: message, type: 'warning'})
  },
  message: (message) => {
    return Message({message: message, type: 'message'})
  }
}
