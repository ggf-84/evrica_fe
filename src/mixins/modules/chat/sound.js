import {
  mapGetters
} from 'vuex'

let protocol = location.protocol
let urlPath = (protocol === 'http:') ? 'http://localhost/' : 'https://dev.evrica.io/'

const soundPath = urlPath + 'backend/chat/sound'

export default {
  data () {
    return {
      soundPath: soundPath,
      isPlaying: false
    }
  },
  computed: {
    ...mapGetters(['getToken', 'getUser', 'getSettingsChat', 'getCurrentSoundState'])
  },
  methods: {
    playNotificationSound: function () {
      let settings = this.getSettingsChat
      if (typeof settings.notification_sound !== 'undefined' && this.getCurrentSoundState === false) {
        let notificationValue = settings.notification_sound
        let getPath = this.getCustomSound(notificationValue)
        this.playSoundUrl(getPath)
      }
    },
    playTypingSound: function () {
      let settings = this.getSettingsChat
      if (typeof settings.user_typing_sound !== 'undefined' && this.getCurrentSoundState === false) {
        let notificationValue = settings.user_typing_sound
        let getPath = this.getCustomSound(notificationValue)
        this.playSoundUrl(getPath)
      }
    },
    playSoundCode: function (code) {
      let settings = this.getSettingsChat
      if (code === 'user_typing_sound') {
        if (typeof settings.user_typing_sound !== 'undefined' && this.getCurrentSoundState === false) {
          let notificationValue = settings.user_typing_sound
          let getPath = this.getCustomSound(notificationValue)
          this.playSoundUrl(getPath)
        }
      } else if (code === 'notification_sound') {
        if (typeof settings.notification_sound !== 'undefined' && this.getCurrentSoundState === false) {
          let notificationValue = settings.notification_sound
          let getPath = this.getCustomSound(notificationValue)
          this.playSoundUrl(getPath)
        }
      }
    },
    playSoundUrl: function (audioSrc) {
      var self = this
      var audio = new Audio(audioSrc)

      // check if audio finished playing and play sound again
      if (!audio.duration > 0 && audio.paused && this.isPlaying === false && this.getCurrentSoundState === false) {
        audio.play()
        this.isPlaying = true
        audio.addEventListener('ended', function () {
          audio.currentTime = 0
          self.isPlaying = false
        })
      }
    },
    getCustomSound: function (name) {
      let pathSound = this.soundPath + '/'
      let pathAudio = pathSound + name + '?token='
      let pathToken = pathAudio + this.getToken

      return pathToken
    }
  }
}
