import { Notification } from 'element-ui'

// docs: http://element.eleme.io/#/en-US/component/notification

// How to import
// import notifiction from '../../mixins/modules/notifications/notification'

// How to use
// notifiction.error('New Notification!', 'Message for this notification')

export default {
  success: (title = '', message = '') => {
    return Notification({ title: title, message: message, type: 'success' })
  },
  warning: (title = '', message = '') => {
    return Notification({ title: title, message: message, type: 'warning' })
  },
  error: (title = '', message = '') => {
    return Notification({ title: title, message: message, type: 'error' })
  },
  info: (title = '', message = '') => {
    return Notification({ title: title, message: message, type: 'info' })
  }
}
