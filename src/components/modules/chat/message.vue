<template>
<div>

<!-- display message -->
<span v-if="model" v-html="model"></span>
<!-- img or file display -->
<span v-if="msgFiles.length >= 1">
<span v-for="(file,index) in msgFiles" :key="index">
<a :href="file.url" class="ref-link" target="_blank">
<div v-if="file.thumbnail !== 'default.png'">
<div class="thumb-message" :style="{ 'background-image': 'url(' + file.thumbnail + ')' }"></div>
</div>
<div v-else><br>{{file.name}} {{file.size}}</div>
</a>
</span>
</span>

</div>
</template>


<script>
import messageMixin from '../../../mixins/modules/chat/message.js'
import { load as loadEmojis, parse } from 'gh-emoji'

export default {
  computed: {
    model: {
      get () {
        if (this.data[this.indexKey] && this.data[this.indexKey].message) {
          loadEmojis().then(() => {
            this.data = parse(this.data[this.indexKey].message)
          })
        }
        return typeof this.data === 'string' ? this.data : null
      },
      set (val) {
      },
      returnOptions: function () {
        if (this.data != null) {
          return this.data
        }
        return {}
      }
    }
  },
  data: function () {
    return {
      data: '',
      msgFiles: []
    }
  },
  components: { },
  props: ['content', 'files', 'indexKey'],
  mixins: [messageMixin],
  methods: {
  },
  created: function () {
    console.log(this.data)
    if (this.content) {
      this.data = this.content
    }
    if (this.files.length >= 1) {
      this.msgFiles = this.files
    }
  }
}
</script>
<style>
.gh-emoji{
  width: 25px;
  height: 25px;
  position: relative;
  top:5px;
}
.thumb-message{
  width: 100px;
  height: 100px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}
.ref-link{
  color: inherit; /* blue colors for links too */
  text-decoration: inherit; /* no underline */
}
</style>
