<template>
  <div>
    <transition name="fade">
  <div class="emoji-picker-container">
    <div class="emoji-picker-btn"><i class="el-icon-error emoji-close-icon" @click="closePicker"></i></div>
    <div><b>Emoji Picker:</b></div>
    <br>
    <div class="container-emoji-scroll" ref="emojiPickerContainer">
      <span v-for="(emoji,index) in emojiList" :key="index">
      <img :src="emoji" class="emoji-icon" @click="pickEmoji(index)">
      </span>
      <div>
      <el-upload
      ref="upload"
      :action="uploadEmojiUrl+'?token='+getToken"
      :auto-upload="true"
      name="file"
      :on-success="onUploadEmoji"
      :show-file-list="false"
      >
      <span slot="trigger"><b>Custom emojis:</b> <i class="el-icon-circle-plus-outline emoji-add-icon"></i></span>
      </el-upload>
      <br>
      <span v-for="(customEmoji,index) in customEmojiList" :key="index">
      <img :src="getCustomEmojiImg(customEmoji.thumbnail)" class="emoji-icon" @click="pickEmoji(customEmoji.code)">
      </span>
      </div>
    </div>
  </div>
</transition>
</div>
</template>

<script>
import { load as loadEmojis, all as allEmojis } from 'gh-emoji'
import socketMixin from '../../../mixins/modules/chat/socket'
import {
  mapGetters
} from 'vuex'

let protocol = location.protocol
let urlPath = (protocol === 'http:') ? 'http://localhost/' : 'https://dev.evrica.io/'

const uploadEmojiUrl = urlPath + 'backend/api/upload/emoji'
const emojiThumbnailPath = urlPath + 'backend/chat/emoji/thumbnail'

export default {
  name: 'emojiPicker',
  computed: {
    customEmojiList: {
      get () {
        let lengthCustom = this.customEmoji.length
        let lengthOld = this.custom.length
        if (this.custom && this.custom.length >= 1 && lengthCustom !== lengthOld) {
          this.customEmoji = this.custom
          this.currentEmojiPage++
          // update page number
          this.$store.dispatch('setCurrentEmojiPage', {page: parseInt(this.currentEmojiPage)})
        }

        return this.customEmoji
      }
    },
    returnCustomEmoji: function () {
      if (this.custom != null) {
        return this.custom
      }
      return []
    },
    ...mapGetters(['getToken', 'getUser', 'getAuthHeader', 'getCurrentRoom', 'getCurrentEmojiPage'])
  },
  props: {
    custom: {
      type: Array,
      default: () => {
        return {}
      }
    }
  },
  mixins: [socketMixin],
  data () {
    return {
      emojiList: [],
      uploadEmojiUrl: uploadEmojiUrl,
      emojiThumbnailPath: emojiThumbnailPath,
      customEmoji: [],
      currentEmojiPage: 1,
      currentEmojiLimit: 10,
      lastScrollEmojiPicker: false,
      pageHeightEmojiPicker: 0,
      emojiPickerBottom: false
    }
  },
  updated: function () {
    var self = this
    // listen scroll emoji
    let windowEmojis = this.$refs.emojiPickerContainer
    if (windowEmojis) {
      windowEmojis.addEventListener('scroll', () => {
        this.emojiPickerBottom = this.bottomEmojisVisible()
        if (this.emojiPickerBottom) {
          this.getCustomEmoji()
          // scroll to bottom
          this.$nextTick(function () {
            let container = self.$refs.emojiPickerContainer
            container.scrollTo(0, self.pageHeightEmojiPicker)
          })
        }
      })
    }
  },
  created: function () {
    var self = this
    loadEmojis().then(() => {
      self.emojiList = allEmojis()
      self.getCustomEmoji()
      self.customEmoji = self.returnCustomEmoji
      self.currentEmojiPage = self.getCurrentEmojiPage
      this.$emit('loading', true)
    })
  },
  methods: {
    bottomEmojisVisible () {
      let windowEmojis = this.$refs.emojiPickerContainer
      let scrollY = windowEmojis.scrollTop
      let visible = windowEmojis.clientHeight
      let pageHeight = windowEmojis.scrollHeight
      let bottomOfPage = visible + (scrollY + 10) >= pageHeight

      if (!this.lastScrollEmojiPicker && bottomOfPage) {
        this.lastScrollEmojiPicker = true
        this.pageHeightEmojiPicker = pageHeight
        return true
      } else if (this.lastScrollEmojiPicker && bottomOfPage) {
        this.lastScrollEmojiPicker = true
        return false
      } else if (!bottomOfPage) {
        this.lastScrollEmojiPicker = false
        return false
      }

      return bottomOfPage || pageHeight < visible
    },
    pickEmoji: function (emoji) {
      let emojiText = ' :' + emoji + ': '
      this.$emit('emojiSelect', emojiText)
    },
    closePicker: function () {
      this.$emit('closePicker', false)
    },
    onUploadEmoji: function (response, file, fileList) {
      if (response.data) {
        let id = response.data.id
        var data = { event: 'newEmoji', data: { emojiID: id } }
        this.sendSocketData(data)
      }
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    getCustomEmoji: function () {
      var data = { event: 'getEmojis', data: { page: this.currentEmojiPage, limit: this.currentEmojiLimit } }
      this.sendSocketData(data)
    },
    getCustomEmojiImg: function (thumb) {
      let pathRoom = this.emojiThumbnailPath + '/'
      let pathThumb = pathRoom + thumb + '?token='
      let pathToken = pathThumb + this.getToken

      return pathToken
    }
  }
}
</script>
<style>

.emoji-picker-container{
  position: absolute;
  right: 50px;
  bottom: 60px;
  z-index: 999;
  display: block;
  width: 305px;
  padding: 1em;
  margin-top: 5px;
  background: rgb(255, 255, 255);
  border: 1px solid rgb(223, 223, 223);
  border-radius: 3px;
  -webkit-box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 1px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 1px;
}

.container-emoji-scroll{
  height: 300px;
  max-height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.emoji-picker-container::-webkit-scrollbar {
  width: 5px;
}

.emoji-picker-container::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: #555;
}

.emoji-icon{
  width: 30px;
  height: 30px;
  cursor: pointer;
  padding: 0.2em;
  border: 1px solid #f2f2f2;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.emoji-picker-btn{
  cursor: pointer;
  font-size: 1.4em;
  clear: both;
  display: block;
  margin-bottom: 1em;
}

.emoji-close-icon{
  float: right;
}

.emoji-add-icon{
  cursor: pointer;
  font-size: 1.5em;
  margin-left: 0.4em;
  position: relative;
  top:5px;
}

</style>
