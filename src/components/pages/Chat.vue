<template >
  <div>
    <chat :authRequested="authRequested"></chat>
  </div>
</template>

<script>
import chat from '../modules/chat/chat.vue'
import socketMixin from '../../mixins/modules/chat/socket.js'

export default {
  name: 'Chat',
  data () {
    return {
      authRequested: false
    }
  },
  mixins: [
    socketMixin
  ],
  components: {
    chat
  },
  created: function () {
    this.authRequested = true
  }
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="scss">

</style>
