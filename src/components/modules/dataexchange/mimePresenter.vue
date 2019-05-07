<template>
<div class="mime-presenter">
  <div class="img-container" v-if="returnItem.extension !== 'folder' && parseInt(returnItem.has_thumbnail) === 1">
    <div class="thumbnail-preview" v-bind:style="{ 'background-image': 'url(' + getItemThumbnail() + ')' }"></div>
  </div>
  <div class="img-container" v-else-if="returnItem.extension === 'folder' && parseInt(returnItem.has_thumbnail) === 0">
    <div class="thumbnail-preview-folder" v-bind:style="{ 'background-image': 'url(' + require('@/assets/folder-icon.png') + ')' }"></div>
  </div>
  <div class="img-container" v-else-if="returnItem.extension !== 'folder' && parseInt(returnItem.has_thumbnail) === 0 && !isVideo()">
    <div class="thumbnail-preview-folder" v-bind:style="{ 'background-image': 'url(' + require('@/assets/images.jpg') + ')' }"></div>
  </div>
  <div class="mime-container" v-if="returnMime !== null">
    <video-player v-if="isVideo()" class="video-player-box" ref="videoPlayer" :options="playerOptions" :playsinline="true" customEventName="customstatechangedeventname" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" @statechanged="playerStateChanged($event)"
      @ready="playerReadied">
    </video-player>
    <span>{{returnMime.mimetype}}</span>
  </div>
</div>
</template>

<script>
// require styles
import 'video.js/dist/video-js.css'
import {
  videoPlayer
} from 'vue-video-player'
import {
  mapGetters
} from 'vuex'
import dataMixin from '../../../mixins/modules/dataexchange/dataModifier.js'

export default {
  data () {
    return {
      dataMime: [],
      dataItem: {},
      playerOptions: {}
    }
  },
  mixins: [
    dataMixin
  ],
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    },
    returnMime: {
      get () {
        this.dataMime = this.mime
        return this.dataMime
      },
      set (val) {
        this.dataMime = val
        this.$emit('set', this.dataMime)
      }
    },
    returnItem: {
      get () {
        this.dataItem = this.item
        return this.dataItem
      },
      set (val) {
        this.dataItem = val
        this.$emit('set', this.dataItem)
      }
    },
    ...mapGetters(['getToken', 'getUser'])
  },
  props: {
    mime: {
      type: Object,
      default: () => {
        return {}
      }
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    returnItem: function (val) {
      // make player options
      this.playerOptions = this.getPlayerOptions()
    }
  },
  components: {
    videoPlayer
  },
  mounted () {},
  created () {
    // make player options
    this.playerOptions = this.getPlayerOptions()
  },
  methods: {
    onPlayerPlay (player) {
    },
    onPlayerPause (player) {
    },
    playerStateChanged (playerCurrentState) {
    },
    playerReadied (player) {
    },
    getItemThumbnail: function () {
      let url = this.$BaseUrl + '/file/' + this.returnItem.hash + '/thumbnail'
      return url
    },
    getVideoUrl: function () {
      let url = this.$BaseUrl + '/file/' + this.returnItem.hash
      return url
    },
    getPlayerOptions: function () {
      let videoURL = this.getVideoUrl()
      return {
        // videojs options
        muted: false,
        language: 'en',
        autoplay: false,
        height: '300px',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: (this.returnMime !== null) ? this.returnMime.mimetype : '',
          src: videoURL
        }],
        poster: require('@/assets/default-thumbnail.jpg')
      }
    },
    isVideo: function () {
      // mime is video
      let mime = (this.returnMime !== null) ? this.returnMime.mimetype.includes('video') : 0
      if (mime === 0) {
        return false
      } else {
        return mime
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mime-container {
  margin-bottom: 1em;
  font-weight: bold;
  margin-top: 1em;
}

.thumbnail-preview {
  width: 300px;
  min-height: 250px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  border: 1px solid #000;
}

.thumbnail-preview-folder {
  width: 100px;
  height: 100px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}

.img-container {
  margin-top: 1em;
}

.mime-presenter {
  margin-bottom: 1em;
}
</style>
