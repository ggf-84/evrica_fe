<template>
<div v-if="showSettings">
  <el-dialog
  title="Chat Settings"
  :visible.sync="showSettings"
  width="50%"
  :before-close="handleClose"
  >
  <div>

<div v-if="settingsGroup.length >= 1">
 <el-tabs :tab-position="tabPosition" style="height: 200px;">
   <el-tab-pane v-for="(setting, index) in settingsGroup" :key="index" class="settings-container">
     <span slot="label">{{setting.i18n.title}}</span>
     <div>
     <div v-for="(settingOption, index) in setting.settings" :key="index" class="option-data">
       <span>{{settingOption.i18n.title}}</span>
       <div v-if="settingOption.user_settings">
         <div v-if="setting.code === 'chat_sound'">
           <span>Current <i class="icon-sound el-icon-service" @click="playSoundCode(settingOption.code)"></i></span>
           <br>
           <el-select
           v-model="selectSound[index]"
           filterable
           remote
           clearable
           @change="changeSelect(settingOption, selectSound[index])"
           auto-complete="on"
           placeholder="Please enter a keyword"
           :remote-method="remoteMethod"
           :loading="loading">
           <el-option
           v-for="item in sounds"
           :key="item.id"
           :label="item.original_name"
           :value="item.original_name">
           </el-option>
           </el-select>
         </div>
       </div>
       <div v-else>
         <div v-if="setting.code === 'chat_sound'">

          <el-select
          v-model="selectSound[index]"
          filterable
          remote
          clearable
          @change="changeSelect(settingOption, selectSound[index])"
          auto-complete="on"
          placeholder="Please enter a keyword"
          :remote-method="remoteMethod"
          :loading="loading">
          <el-option
          v-for="item in sounds"
          :key="item.id"
          :label="item.original_name"
          :value="item.original_name">
          </el-option>
          </el-select>

         </div>
       </div>
     </div>
     <div v-if="setting.code === 'chat_sound'">
      <el-upload
      class="upload-demo"
      :action="soundUploadUrl + '?token=' + getToken"
      :on-success="successUpload"
      :on-error="errorUpload"
      multiple>
      <el-button size="small" type="primary">Upload a chat sound</el-button>
      </el-upload>
     </div>
   </div>
   </el-tab-pane>
 </el-tabs>
</div>
<div v-else>
  No settings available
</div>


  </div>
  <span slot="footer" class="dialog-footer">
    <el-button v-if="getCurrentSoundState" @click="muteSounds(false)">Unmute Sounds <i class="icon-sound el-icon-success" ></i></el-button>
    <el-button v-else @click="muteSounds(true)">Mute Sounds <i class="icon-sound el-icon-error" ></i></el-button>

    <el-button @click="showOrHideSettings()">Close</el-button>
    <el-button type="primary" @click="showOrHideSettings()">Confirm</el-button>
  </span>
</el-dialog>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import soundMixin from '../../../mixins/modules/chat/sound'
import socketMixin from '../../../mixins/modules/chat/socket'
import message from '../../../mixins/modules/notifications/message'

let protocol = location.protocol
let urlPath = (protocol === 'http:') ? 'http://localhost/' : 'https://dev.evrica.io/'

const soundUploadUrl = urlPath + 'backend/api/upload/sound'
const soundPath = urlPath + 'backend/chat/sound'

export default {
  computed: {
    settingsGroup: {
      get () {
        this.settings = this.chatSettings

        return this.settings
      }
    },
    returnChatSettings: function () {
      if (this.chatSettings != null) {
        return this.chatSettings
      }
      return []
    },
    ...mapGetters(['getToken', 'getUser', 'getCurrentSoundState'])
  },
  props: {
    showSettings: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    chatSettings: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mixins: [
    socketMixin,
    soundMixin
  ],
  data: function () {
    return {
      settings: [],
      tabPosition: 'left',
      soundUploadUrl: soundUploadUrl,
      list: [],
      loading: false,
      selectSound: [],
      sounds: [],
      soundPath: soundPath
    }
  },
  components: {
  },
  methods: {
    showOrHideSettings: function () {
      if (this.showSettings) {
        this.$emit('hideSettings', false)
      } else {
        this.$emit('hideSettings', true)
      }
    },
    changeSelect: function (option, sound) {
      var data = { event: 'updateCreateSettings', data: {setting: option, data: sound, label: 'sound'} }
      this.sendSocketData(data)

      // update chat settings
      this.$store.dispatch('setCurrentUserChatSettings', {})
    },
    getChatSettings: function () {
      var data = { event: 'getChatSettings', data: {} }
      this.sendSocketData(data)
    },
    handleClose (done) {
      this.showOrHideSettings()
    },
    successUpload: function (response, file, fileList) {
      message.success('Sound was successfully uploaded')
    },
    errorUpload: function (err, file, fileList) {
      let json = JSON.parse(err.message)
      let messageText = json.message
      message.warning(messageText)
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        var self = this
        this.$http.get('chat/sounds?_filters[]=original_name-lk=' + '*' + query + '*').then(response => {
          this.loading = false
          self.sounds = response.body.data
        })
      } else {
        this.sounds = []
      }
    },
    muteSounds: function (state) {
      this.$store.dispatch('setCurrentSoundState', {state: state})
    }
  },
  mounted () {
  },
  updated: function () {
    this.settings = this.returnChatSettings
  },
  created: function () {
    this.getChatSettings()
  }
}
</script>

<style scoped="scss">
  .option-description{
    color: #ccc;
    display: block;
  }

  .option-data{
    margin-bottom: 2em;
  }

  .settings-container{
    overflow-y: scroll;
    overflow-x: hidden;
    min-height: 200px;
    height: 200px;
  }

  .icon-sound {
    font-size: 1.5em;
    cursor: pointer;
  }
</style>
