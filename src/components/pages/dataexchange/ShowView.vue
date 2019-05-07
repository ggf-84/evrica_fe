<template>
  <div class="share-container">
     <div v-if="hasError">
       <h3><b>{{errorText}}</b></h3>
     </div>
     <div v-if="passwordRequired">
       <passwordForm @submitForm="onSubmitForm($event)"></passwordForm>
     </div>
     <div v-if="!passwordRequired">
       <div v-if="typeof getCurrentShareItem.share.description !== 'undefined' && getCurrentShareItem.share.description !== null" class="description">
         <span>Description: {{getCurrentShareItem.share.description}}</span>
       </div>
       <itemView :item="currentSharedItem" :password="passwordText"></itemView>
     </div>
  </div>
</template>

<script>
import {
  EventBus
} from '../../../mixins/modules/dataexchange/eventBus.js'
import dataMixin from '../../../mixins/modules/dataexchange/dataModifier.js'
import backendMixin from '../../../mixins/modules/dataexchange/backend.js'
import loader from '../../modules/dataexchange/loading.vue'
import passwordForm from '../../modules/dataexchange/share/dePasswordForm'
import itemView from '../../modules/dataexchange/share/itemView'
import functionsMixin from '../../../mixins/modules/dataexchange/functions.js'
import {
  mapGetters
} from 'vuex'

export default {
  name: 'ShowView',
  data () {
    return {
      shareToken: '',
      permissionErrors: {
        'permission_not_found': "You don't have required permissions",
        'password_not_set': 'This share is password protected',
        'password_does_not_match': 'This password is wrong , try again'
      },
      currentSharedItem: {},
      hasError: false,
      errorText: '',
      passwordRequired: false,
      passwordText: '',
      backendJSEvents: {
        getItemData: function (data, self) {
          if (typeof data.data.status !== 'undefined') {
            self.parseErrors(data.data)
          } else {
            self.hasError = false
            self.passwordRequired = false
            self.errorText = ''
            self.currentSharedItem = data.data
            // set store data
            self.$store.dispatch('setCurrentShareItem', data.data)
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['getToken', 'getUser', 'getSelectedParent', 'getCurrentItem', 'getCurrentShareItems', 'getCurrentShareItem'])
  },
  components: {
    EventBus,
    loader,
    passwordForm,
    itemView
  },
  mixins: [
    dataMixin,
    backendMixin,
    functionsMixin
  ],
  methods: {
    GetBackendJs: function (data) {
      // get path
      var globalPath = data.path
      // check path
      if (globalPath === 'de/shared') {
        // get item data
        this.backendJSEvents['getItemData'](data, this)
      }
    },
    parseErrors: function (data) {
      // check error codes and set messages
      if (parseInt(data.body.app_code) === 404) {
        // check message
        let message = data.body.message
        this.hasError = true
        this.errorText = this.permissionErrors[message]
      } else if (parseInt(data.body.app_code) === 422) {
        let message = data.body.errors.message
        this.hasError = true
        this.passwordRequired = true
        this.errorText = this.permissionErrors[message]
      }
    },
    onSubmitForm: function (data) {
      // set object
      var obj = {}
      obj = {
        item: this.shareToken,
        hasPassword: true,
        password: data.password
      }
      this.passwordText = data.password
      // set store data
      this.$store.dispatch('setCurrentShareItems', obj)
      // send request
      let makeParams = '/' + this.shareToken + '?password=' + data.password
      this.sendGet('de/shared', makeParams, true)
    }
  },
  mounted () {
    EventBus.$on('GetBackendJs', data => {
      return this.GetBackendJs(data)
    })
  },
  created () {
    this.shareToken = this.$route.params.token
    // grab the Array item which matchs the item token
    let savedPasswords = this.getCurrentShareItems
    var item = savedPasswords.find(item => item.item === this.shareToken)
    let itemExists = (typeof item !== 'undefined') ? 1 : 0
    let requirePassword = (itemExists === 1 && item.hasPassword) ? 1 : 0
    let password = (itemExists === 1) ? item.password : ''
    // send get request
    var makeParams
    if (requirePassword === 1) {
      makeParams = '/' + this.shareToken + '?password=' + password
    } else {
      makeParams = '/' + this.shareToken
    }
    this.sendGet('de/shared', makeParams, true)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .share-container {
    padding-top: 6em;
    padding-left: 2em;
    padding-right: 2em;
    text-align: left;
  }

  .description {
    margin-left: 1em;
    margin-right: 1em;
    font-weight: bold;
    margin-bottom: 1em;
    font-size: 1.2em;
    color: #e74c3c;
  }
</style>
