import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import store from './../../store'
import router from './../../router'

let protocol = location.protocol
let setUrl = (protocol === 'http:') ? store.getters.getSocketLocalUrl : store.getters.getSocketDevUrl

export const SocketInstance = io(setUrl, {
  reconnection: false
})

Vue.use(VueSocketIO, SocketInstance)

export default {
  setSocket: function () {
    store.dispatch('SOCKET_connected', {value: SocketInstance.connected})
    // set auth data
    this.sendAuth()
  },
  sendAuth: function () {
    // set auth data
    var route = router.match(location)
    var windowName = ''
    if (route.fullPath) {
      var split = route.fullPath.split('/')
      if (split[2] && split[2] === 'page' && split[3]) {
        windowName = split[3]
      } else {
        windowName = split[2]
      }
    }

    var data = {
      event: 'auth',
      window: windowName,
      data: {
        'token': store.getters.getToken
      }
    }
    SocketInstance.json.send(data)
  }
}
