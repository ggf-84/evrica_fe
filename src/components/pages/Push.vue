<template>
<div>
  <span>Worker and push notification testing</span>
  <el-input placeholder="Notification title" v-model="inputTitle" id="title"></el-input>
  <br><br>
  <el-input placeholder="Notification description" v-model="inputDescription" id="description"></el-input>
  <br><br>
  <el-input placeholder="Notification Icon (URL)" v-model="inputIcon" id="icon"></el-input>
  <br><br>
  <el-button @click="enableNotifications()" v-if="getWorkerPermission === false">Enable Push</el-button>
  <el-button @click="sendNotification()">Send Push</el-button>
</div>
</template>

<script>
import pushMixin from '@/mixins/modules/push/pushNotification'
import {
  mapGetters
} from 'vuex'

export default {
  name: 'Push',
  mixins: [
    pushMixin
  ],
  computed: {
    ...mapGetters(['getToken', 'getWorkerStatus', 'getWorkerPermission'])
  },
  data () {
    return {
      inputTitle: 'Worker notification title',
      inputDescription: 'Worker notification description',
      inputIcon: 'https://icon-icons.com/icons2/1283/PNG/512/1497619898-jd24_85173.png',
      workerRegistered: false
    }
  },
  methods: {
  },
  created () {
    var currentPermission = this.getPermission()
    if (!this.getWorkerStatus || currentPermission !== 'granted') {
      this.registerServiceWorker()
      this.askPermission()
    }
  }
}
</script>
<style scoped>
input {
  width: 300px;
}
</style>
