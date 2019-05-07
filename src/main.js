// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import store from './store'
import authMixin from './mixins/modules/auth'
import ignore from './router/ignored'
import socketJS from './store/utils/socket'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import vuexI18n from 'vuex-i18n'

Vue.use(authMixin)
Vue.use(Element)
Vue.use(Vuex)
Vue.use(VueResource)
Vue.use(socketJS)
Vue.use(vuexI18n.plugin, store)

/**
 * Url config
 */

// get current used protocol ('http:' or 'https:')
let protocol = location.protocol
// set baseUrl of backend
// CHANGE HERE ------->
let baseUrl = (protocol === 'https:') ? 'https://dev.evrica.io/backend' : 'http://localhost/backend'
// set global constant
Vue.prototype.$BaseUrl = baseUrl

/* get url for env */
let env = process.env.NODE_ENV
// set url for assets
let getWebUrl = (env === 'development') ? 'http://localhost:8080/src/assets/' : 'https://dev.evrica.io/src/assets/'
/**
 * End URL config
 */

/* set global variable for web url */
Vue.prototype.$assetsURL = getWebUrl
Vue.prototype.$globalURL = baseUrl

/* set main root for requests */
Vue.http.options.root = baseUrl + '/api'

// set global value for system requests
if (store.getters.authorized) {
  Vue.http.headers.common['Authorization'] = 'Bearer ' + store.getters.getToken
  // set Accepted-Language Header for current selected language
  if (store.getters.getLanguage) {
    let languageCode = store.getters.getLanguage.code + `;q=1;`
    Vue.http.headers.common['Accept-Language'] = languageCode
  }
}

Vue.config.productionTip = false

// set socket
socketJS.setSocket()

// TO DO: Move this code to another file
router.beforeEach((to, from, next) => {
  if (ignore.routes.indexOf(to.name) > -1) {
    next()
    return true
  }
  if (!store.getters.authorized || !store.getters.getToken) {
    router.push('auth')
    return false
  }
  next()
})

// interceptor for requests
// here we can check if user is authorized
Vue.http.interceptors.push(function (request, next) {
  next(function (response) {
    if (response.status === 400 || response.status === 401) {
      // if request response is error redirect
      if (response.body.app_code) {
        store.dispatch('addAuthError', response).then(function () {
          router.push('auth')
        })
      }
    }
  })
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
