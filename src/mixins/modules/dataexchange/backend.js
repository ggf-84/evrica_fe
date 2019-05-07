import { EventBus } from './eventBus.js'
import notifiction from '../notifications/notification'

export default {
  methods: {
    sendPost: function (path, params = null, data = null) {
      if (params !== null) {
        this.$http.post(path + params, data).then(response => {
          EventBus.$emit('PostBackendJs', {path: path, data: response.body.data})
          return response.body.data
        }, (response) => {
          if (!response.ok) {
            if (response.status === 422) {
              notifiction.error('System !', response.body.errors.message)
            } else if (response.status === 400) {
            } else {
              notifiction.error('System !', response.statusText)
            }
          }
        })
      } else {
        this.$http.post(path, data).then(response => {
          EventBus.$emit('PostBackendJs', {path: path, data: response.body.data})
          return response.body.data
        }, (response) => {
          if (!response.ok) {
            if (response.status === 422) {
              notifiction.error('System !', response.body.errors.message)
            } else if (response.status === 400) {
            } else {
              notifiction.error('System !', response.statusText)
            }
          }
        })
      }
    },
    sendPut: function (path, params = null, data = null) {
      if (params !== null) {
        this.$http.put(path + params, data).then(response => {
          EventBus.$emit('PutBackendJs', {path: path, data: response.body.data})
          return response.body.data
        }, (response) => {
          if (!response.ok) {
            if (response.status === 422) {
              notifiction.error('System !', response.body.errors.message)
            } else if (response.status === 400) {
            } else {
              notifiction.error('System !', response.statusText)
            }
          }
        })
      } else {
        this.$http.post(path, data).then(response => {
          EventBus.$emit('PutBackendJs', {path: path, data: response.body.data})
          return response.body.data
        })
      }
    },
    sendGet: function (path, params = null, getFailResponse = false) {
      if (params !== null) {
        this.$http.get(path + params).then(response => {
          EventBus.$emit('GetBackendJs', {path: path, data: response.body.data})
          return response.body.data
        }, (response) => {
          if (!response.ok) {
            if (getFailResponse) {
              EventBus.$emit('GetBackendJs', {path: path, data: response})
            }
          }
        })
      } else {
        this.$http.get(path).then(response => {
          EventBus.$emit('GetBackendJs', {path: path, data: response.body.data})
          return response.body.data
        })
      }
    },
    sendDelete: function (path, params = null) {
      if (params !== null) {
        this.$http.delete(path + params).then(response => {
          EventBus.$emit('DeleteBackendJs', {path: path, data: response.body.data})
          return response.body.data
        })
      } else {
        this.$http.delete(path).then(response => {
          EventBus.$emit('DeleteBackendJs', {path: path, data: response.body.data})
          return response.body.data
        })
      }
    },
    sendPatch: function (path, data = null) {
      this.$http.patch(path, [data]).then(response => {
        return response.body.data
      })
    }
  }
}
