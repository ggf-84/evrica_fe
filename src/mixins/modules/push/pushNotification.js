import {
  mapGetters
} from 'vuex'

var _registration = null

export default {
  computed: {
    ...mapGetters(['getToken', 'getUser', 'getAuthHeader'])
  },
  methods: {
    data: function () {
      return {
        _registration: _registration,
        registered: false
      }
    },
    registerServiceWorker: function () {
      let pathUrl = this.$assetsURL
      var self = this
      // register service worker
      return navigator.serviceWorker.register(pathUrl + 'workers/service-worker.js')
      .then(function (registration) {
        console.log('Service worker successfully registered.')
        self._registration = registration
        self.$store.dispatch('setWorkerStatus', true)
        // return object
        return registration
      }).catch(function (err) {
        console.error('Unable to register service worker.', err)
      })
    },
    removeServiceWorker: function () {
      if (window.navigator && navigator.serviceWorker) {
        console.log('Service worker successfully unregistered.')
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
          for (let registration of registrations) {
            registration.unregister()
          }
        })
      }
    },
    getPermission: function () {
      return Notification.permission
    },
    askPermission: function () {
      var self = this
      return new Promise(function (resolve, reject) {
        const permissionResult = Notification.requestPermission(function (result) {
          resolve(result)
        })
        if (permissionResult) {
          permissionResult.then(resolve, reject)
        }
      })
      .then(function (permissionResult) {
        if (permissionResult !== 'granted') {
          throw new Error('We weren\'t granted permission.')
        } else {
          self.subscribeUserToPush()
        }
      })
    },
    urlBase64ToUint8Array: function (base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4)
      const base64 = (base64String + padding)
          .replace(/-/g, '+')
          .replace(/_/g, '/')
      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray
    },
    getSWRegistration: function () {
      var self = this
      var promise = new Promise(function (resolve, reject) {
      // do a thing, possibly async, then…
        if (self._registration != null) {
          resolve(self._registration)
        } else {
          reject(Error('It broke'))
        }
      })
      return promise
    },
    subscribeUserToPush: function () {
      var self = this
      var VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY
      this.getSWRegistration()
      .then(function (registration) {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: self.urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        }
        return registration.pushManager.subscribe(subscribeOptions)
      })
      .then(function (pushSubscription) {
        console.log('Received PushSubscription: ', JSON.stringify(pushSubscription))
        self.sendSubscriptionToBackEnd(pushSubscription)
        return pushSubscription
      })
    },
    sendSubscriptionToBackEnd: function (subscription) {
      var pathUrl = this.$globalURL
      return fetch(pathUrl + 'api/save-subscription?token=' + this.getToken, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Bad status code from server.')
        }
        return response.json()
      })
      .then(function (responseData) {
        if (!(responseData.data && responseData.data.success)) {
          throw new Error('Bad response from server.')
        }
      })
    },
    enableNotifications: function () {
      // register service worker
      // check permission for notification/ask
      this.askPermission()
    },
    sendNotification: function () {
      let pathUrl = this.$globalURL
      var data = new FormData()
      data.append('title', this.inputTitle)
      data.append('body', this.inputDescription)
      data.append('icon', this.inputIcon)
      var xhr = new XMLHttpRequest()
      xhr.open('POST', pathUrl + 'api/send-notification?token=' + this.getToken, true)
      xhr.onload = function () {
      // do something to response
      // console.log(this.respo{nseText)
      }
      xhr.send(data)
    }

  }
}
